var db;

var newItem = [
    { name: "", rate: 0, description: "" }
];


window.onload = function () {
    var taskList = document.getElementById('task-list');
    var taskForm = document.getElementById('task-form');
    var name = document.getElementById('name');
    var rate = document.getElementById('rate');
    var description = document.getElementById('description');
    var submit = document.getElementById('submit');
    var close = document.getElementById('close');

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    var DBOpenRequest = window.indexedDB.open("rateList", 4);
    DBOpenRequest.onerror = function (event) {
    };

    DBOpenRequest.onsuccess = function (event) {
        db = DBOpenRequest.result;
        displayData();
    };
    DBOpenRequest.onupgradeneeded = function (event) {
        var db = event.target.result;

        db.onerror = function (event) {
        };

        var objectStore = db.createObjectStore("rateList", { keyPath: "name" });
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("rate", "rate", { unique: false });
        objectStore.createIndex("description", "description", { unique: false });
    };


    function displayData() {
        taskList.innerHTML = "";
        var objectStore = db.transaction('rateList').objectStore('rateList');
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var listItem = document.createElement('div');
                taskList.appendChild(listItem);
                listItem.setAttribute('id', "wrapper");
                var listDiv = document.createElement('div');
                listItem.appendChild(listDiv);
                listDiv.setAttribute('style', "width: 80%");
                var listLDiv = document.createElement('div');
                if (cursor.value.description == "")
                { listLDiv.innerHTML = cursor.value.name + ': ' + cursor.value.rate; }
                else
                { listLDiv.innerHTML = cursor.value.name + ': ' + cursor.value.rate + ', ' + cursor.value.description;}
                listDiv.appendChild(listLDiv);
                listLDiv.setAttribute('class', "l");
                var listBDiv = document.createElement('div');
                listItem.appendChild(listBDiv);
                listBDiv.setAttribute('style', "width: 20%");
                var listRDiv = document.createElement('div');
                listBDiv.appendChild(listRDiv);
                listRDiv.setAttribute('class', "r");
                var deleteButton = document.createElement('button');
                listRDiv.appendChild(deleteButton);
                deleteButton.innerHTML = 'X';
                deleteButton.setAttribute('data-task', cursor.value.name);
                deleteButton.onclick = function (event) {
                    deleteItem(event);
                }
                cursor.continue();

            } else {
            }
        }
    }

    taskForm.addEventListener('submit', addData, false);
    close.addEventListener('click', exit);
    var newItem;
    function addData(e) {
        e.preventDefault();
        if (name.value == '' || rate.value == null) {
            window.navigator.vibrate(500);
            return;
        } else {

            newItem = [
                { name: name.value, rate: rate.value, description: description.value }
            ];

            var transaction = db.transaction(["rateList"], "readwrite");

            transaction.oncomplete = function () {
                displayData();
            };

            transaction.onerror = function () {
            };

            var objectStore = transaction.objectStore("rateList");
            var objectStoreRequest = objectStore.add(newItem[0]);
            objectStoreRequest.onsuccess = function (event) {
                name.value = '';
                rate.value = 5;
                description.value = '';
                newItem = null;
            };

        }
        ;

    }
    ;

    function deleteItem(event) {
        var dataTask = event.target.getAttribute('data-task');
        var transaction = db.transaction(["rateList"], "readwrite");
        var request = transaction.objectStore("rateList").delete(dataTask);
        transaction.oncomplete = function () {
            event.target.parentNode.parentNode.removeChild(event.target.parentNode);
            displayData();
        };
    }
    ;
    
    function exit()
    {
        window.close();
    }
}