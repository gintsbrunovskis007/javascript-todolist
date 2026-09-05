const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCreateButton = document.getElementById("task-create-button");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

tasks.forEach((task) => {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  checkbox.checked = task.completed;

  li.appendChild(checkbox);
  li.append(task.text);

  if (task.completed) {
    li.classList.add("completed");
  }

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    li.classList.toggle("completed", checkbox.checked);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  taskList.appendChild(li);
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let taskInputValue = taskInput.value.trim();

  if (taskInputValue === "") {
    return;
  }

  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  li.appendChild(checkbox);
  li.append(taskInputValue);

  taskList.appendChild(li);

  const task = {
    text: taskInputValue,
    completed: false,
  };

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    li.classList.toggle("completed", checkbox.checked);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskForm.reset();
});
