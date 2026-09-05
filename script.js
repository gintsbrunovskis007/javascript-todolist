const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCreateButton = document.getElementById("task-create-button");
const activeTaskList = document.getElementById("active-task-list");
const completedTaskList = document.getElementById("completed-task-list");

let editingTask = null;
let editingTaskText = null;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

tasks.forEach((task) => {
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
  } else {
    li.append(deleteButton);
    completedTaskList.appendChild(li);
    li.classList.add("completed");
    editButton.remove();
  }

  editButton.addEventListener("click", () => {
    editingTask = task;
    editingTaskText = taskText;
    taskInput.value = task.text;
    taskCreateButton.textContent = "Update";
  });

  deleteButton.addEventListener("click", () => {
    tasks = tasks.filter((t) => t !== task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    li.remove();
  });

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;

    if (!task.completed) {
      activeTaskList.appendChild(li);
      li.append(editButton);
      li.classList.remove("completed");
      deleteButton.remove();
    } else {
      li.append(deleteButton);
      completedTaskList.appendChild(li);
      li.classList.add("completed");
      editButton.remove();
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let taskInputValue = taskInput.value.trim();

  if (taskInputValue === "") {
    return;
  }

  if (editingTask) {
    editingTask.text = taskInputValue;
    editingTaskText.textContent = editingTask.text;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    editingTask = null;
    editingTaskText = null;

    taskCreateButton.textContent = "Create";

    taskForm.reset();
    return;
  }

  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";

  const taskText = document.createElement("span");
  taskText.textContent = taskInputValue;

  li.appendChild(checkbox);
  li.append(taskText);
  li.append(editButton);

  activeTaskList.appendChild(li);

  const task = {
    text: taskInputValue,
    completed: false,
  };

  editButton.addEventListener("click", () => {
    editingTask = task;
    editingTaskText = taskText;

    taskInput.value = task.text;
  });

  deleteButton.addEventListener("click", () => {
    tasks = tasks.filter((t) => t !== task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    li.remove();
  });

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;

    if (!task.completed) {
      activeTaskList.appendChild(li);
      li.append(editButton);
      li.classList.remove("completed");
      deleteButton.remove();
    } else {
      li.append(deleteButton);
      completedTaskList.appendChild(li);
      li.classList.add("completed");
      editButton.remove();
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskForm.reset();
});
