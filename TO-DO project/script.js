let db;

// Open IndexedDB database
const request = indexedDB.open("ToDoDB", 1);

request.onupgradeneeded = function (event) {
    let db = event.target.result;
    let objectStore = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("task", "task", { unique: false });
};

request.onsuccess = function (event) {
    db = event.target.result;
    displayTasks();
};

request.onerror = function () {
    console.log("Database error!");
};

// Add Task
function addTask() {
    let taskInput = document.getElementById("taskInput");
    if (taskInput.value.trim() === "") {
        alert("Please enter a task!");
        return;
    }

    let transaction = db.transaction(["tasks"], "readwrite");
    let objectStore = transaction.objectStore("tasks");

    let newTask = { task: taskInput.value };
    let request = objectStore.add(newTask);

    request.onsuccess = function () {
        taskInput.value = "";
        displayTasks();
    };
}

// Display Tasks
function displayTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let transaction = db.transaction(["tasks"], "readonly");
    let objectStore = transaction.objectStore("tasks");

    objectStore.openCursor().onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let listItem = document.createElement("li");
            listItem.innerHTML = `${cursor.value.task} <button class="delete-btn" onclick="deleteTask(${cursor.value.id})">❌</button>`;
            taskList.appendChild(listItem);
            cursor.continue();
        }
    };
}

// Delete Task
function deleteTask(id) {
    let transaction = db.transaction(["tasks"], "readwrite");
    let objectStore = transaction.objectStore("tasks");

    let request = objectStore.delete(id);
    request.onsuccess = function () {
        displayTasks();
    };
}
