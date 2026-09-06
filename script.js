const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCreateButton = document.getElementById("task-create-button");
const activeTaskList = document.getElementById("active-task-list");
const completedTaskList = document.getElementById("completed-task-list");
const activeTaskCountSpan = document.getElementById("active-task-count-span");
const completedTaskCountSpan = document.getElementById(
  "completed-task-count-span",
);

const deleteAllButton = document.createElement("button");
deleteAllButton.textContent = "Delete all";
deleteAllButton.style.display = "none";

completedTaskCountSpan.parentElement.append(deleteAllButton);

let editingTask = null;
let editingTaskText = null;

let activeTaskCount = 0;
let completedTaskCount = 0;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function updateTaskCount() {
  activeTaskCountSpan.textContent = activeTaskCount;
  completedTaskCountSpan.textContent = completedTaskCount;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateDeleteAllButton() {
  deleteAllButton.style.display =
    completedTaskCount > 0 ? "inline-block" : "none";
}

function createTaskElement(task) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";

  const taskText = document.createElement("span");
  taskText.textContent = task.text;

  li.appendChild(checkbox);
  li.append(taskText);

  if (!task.completed) {
    activeTaskList.appendChild(li);
    li.append(editButton);
    deleteButton.remove();
    activeTaskCount++;
  } else {
    li.append(deleteButton);
    completedTaskList.appendChild(li);
    li.classList.add("completed");
    editButton.remove();
    completedTaskCount++;
  }

  deleteButton.addEventListener("click", () => {
    tasks = tasks.filter((t) => t !== task);
    saveTasks();
    li.remove();
    if (task.completed) {
      completedTaskCount--;
    } else {
      activeTaskCount--;
    }

    updateTaskCount();
    updateDeleteAllButton();
  });

  editButton.addEventListener("click", () => {
    editingTask = task;
    editingTaskText = taskText;
    taskCreateButton.textContent = "Update";
    taskInput.value = task.text;
  });

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;

    if (!task.completed) {
      activeTaskList.appendChild(li);
      li.append(editButton);
      li.classList.remove("completed");
      deleteButton.remove();
      activeTaskCount++;
      completedTaskCount--;
    } else {
      li.append(deleteButton);
      completedTaskList.appendChild(li);
      li.classList.add("completed");
      editButton.remove();
      activeTaskCount--;
      completedTaskCount++;
    }

    editingTask = null;
    editingTaskText = null;
    taskForm.reset();
    taskCreateButton.textContent = "Create";

    updateTaskCount();
    updateDeleteAllButton();
    saveTasks();
  });
}

deleteAllButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  completedTaskList.innerHTML = "";
  completedTaskCount = 0;
  updateTaskCount();
  deleteAllButton.style.display = "none";
});

tasks.forEach((task) => {
  createTaskElement(task);
});

updateTaskCount();

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let taskInputValue = taskInput.value.trim();

  if (taskInputValue === "") {
    return;
  }

  if (editingTask) {
    editingTask.text = taskInputValue;
    editingTaskText.textContent = editingTask.text;

    saveTasks();

    editingTask = null;
    editingTaskText = null;

    taskCreateButton.textContent = "Create";

    taskForm.reset();
    return;
  }

  const task = {
    text: taskInputValue,
    completed: false,
  };

  tasks.push(task);
  createTaskElement(task);
  updateTaskCount();
  updateDeleteAllButton();
  saveTasks();
  taskForm.reset();
});
