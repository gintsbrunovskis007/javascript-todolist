const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCreateButton = document.getElementById("task-create-button");
const activeTaskList = document.getElementById("active-task-list");
const completedTaskList = document.getElementById("completed-task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

tasks.forEach((task) => {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  checkbox.checked = task.completed;

  li.appendChild(checkbox);
  li.append(task.text);

  if (!task.completed) {
    activeTaskList.appendChild(li);
  } else {
    completedTaskList.appendChild(li);
    li.classList.add("completed");
  }

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;

    if (!task.completed) {
      activeTaskList.appendChild(li);
      li.classList.remove("completed");
    } else {
      completedTaskList.appendChild(li);
      li.classList.add("completed");
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

  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  li.appendChild(checkbox);
  li.append(taskInputValue);

  activeTaskList.appendChild(li);

  const task = {
    text: taskInputValue,
    completed: false,
  };

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;

    if (!task.completed) {
      activeTaskList.appendChild(li);
      li.classList.remove("completed");
    } else {
      completedTaskList.appendChild(li);
      li.classList.add("completed");
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskForm.reset();
});
