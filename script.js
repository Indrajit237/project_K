// Select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const pendingCount = document.getElementById('pendingCount');
const clearBtn = document.getElementById('clearBtn');

// 1. Load tasks from LocalStorage on startup
document.addEventListener('DOMContentLoaded', getTasks);

// 2. Add Task Event
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// 3. Delete or Check Task Event (Event Delegation)
taskList.addEventListener('click', deleteOrCheck);

// 4. Clear All Event
clearBtn.addEventListener('click', clearAll);

// --- FUNCTIONS ---

function addTask() {
    const taskValue = taskInput.value;

    if (taskValue === '') {
        alert("Please enter a task!");
        return;
    }

    // Create the visual list item
    createTaskElement(taskValue);

    // Save to LocalStorage
    saveLocalTasks(taskValue);

    // Clear input
    taskInput.value = '';
    updateCount();
}

function createTaskElement(text, isCompleted = false) {
    // Create li div
    const li = document.createElement('li');
    li.innerText = text;
    if (isCompleted) li.classList.add('completed');

    // Create delete button
    const deleteBtn = document.createElement('span');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add('delete-icon');
    
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function deleteOrCheck(e) {
    const item = e.target;

    // Delete Task
    if (item.classList.contains('delete-icon') || item.parentElement.classList.contains('delete-icon')) {
        const todo = item.closest('li');
        removeLocalTasks(todo);
        todo.remove();
        updateCount();
    }

    // Check Task (Mark Completed)
    if (item.tagName === 'LI') {
        item.classList.toggle('completed');
        // Note: For a real app, you'd want to update the "completed" status in LocalStorage too
    }
}

function updateCount() {
    const count = taskList.querySelectorAll('li:not(.completed)').length;
    pendingCount.innerText = `You have ${count} pending tasks`;
}

function clearAll() {
    taskList.innerHTML = '';
    localStorage.clear();
    updateCount();
}

// --- LOCAL STORAGE FUNCTIONS ---

function saveLocalTasks(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    
    tasks.forEach(function(task) {
        createTaskElement(task);
    });
    updateCount();
}

function removeLocalTasks(todo) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    
    // Get the text of the task to be removed
    const taskIndex = todo.innerText;
    // Remove it from the array
    tasks.splice(tasks.indexOf(taskIndex), 1);
    // Set the new array back to storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
