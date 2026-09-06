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

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function getTaskCounts() {
  const activeTaskCount = tasks.filter((task) => !task.completed).length;
  const completedTaskCount = tasks.filter((task) => task.completed).length;

  return { activeTaskCount, completedTaskCount };
}

function updateTaskCount() {
  const { activeTaskCount, completedTaskCount } = getTaskCounts();

  activeTaskCountSpan.textContent = activeTaskCount;
  completedTaskCountSpan.textContent = completedTaskCount;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateDeleteAllButton() {
  const { completedTaskCount } = getTaskCounts();

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
    li.append(editButton);
    deleteButton.remove();
  } else {
    li.append(deleteButton);
    li.classList.add("completed");
    editButton.remove();
  }

  deleteButton.addEventListener("click", () => {
    tasks = tasks.filter((t) => t !== task);
    saveTasks();
    renderTasks();
  });

  editButton.addEventListener("click", () => {
    editingTask = task;
    taskCreateButton.textContent = "Update";
    taskInput.value = task.text;
  });

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;

    editingTask = null;
    taskForm.reset();
    taskCreateButton.textContent = "Create";

    saveTasks();
    renderTasks();
  });

  return li;
}

function renderTasks() {
  activeTaskList.innerHTML = "";
  completedTaskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = createTaskElement(task);

    if (task.completed) {
      completedTaskList.appendChild(li);
    } else {
      activeTaskList.appendChild(li);
    }
  });

  updateTaskCount();
  updateDeleteAllButton();
}

deleteAllButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskInputValue = taskInput.value.trim();

  if (taskInputValue === "") {
    return;
  }

  if (editingTask) {
    editingTask.text = taskInputValue;
    editingTask = null;

    saveTasks();
    renderTasks();
    taskForm.reset();
    taskCreateButton.textContent = "Create";

    return;
  }

  const task = {
    text: taskInputValue,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
});
