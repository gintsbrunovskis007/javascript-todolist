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

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  li.appendChild(checkbox);
  li.append(task.text);

  if (!task.completed) {
    activeTaskList.appendChild(li);
  } else {
    li.append(deleteButton);
    completedTaskList.appendChild(li);
    li.classList.add("completed");
  }

  deleteButton.addEventListener("click", () => {
    tasks = tasks.filter((t) => t !== task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    li.remove();
  });

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;

    if (!task.completed) {
      activeTaskList.appendChild(li);
      li.classList.remove("completed");
    } else {
      li.append(deleteButton);
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

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  li.appendChild(checkbox);
  li.append(taskInputValue);

  activeTaskList.appendChild(li);

  const task = {
    text: taskInputValue,
    completed: false,
  };

  deleteButton.addEventListener("click", () => {
    tasks = tasks.filter((t) => t !== task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    li.remove();
  });

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;

    if (!task.completed) {
      activeTaskList.appendChild(li);
      li.classList.remove("completed");
    } else {
      li.append(deleteButton);
      completedTaskList.appendChild(li);
      li.classList.add("completed");
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskForm.reset();
});
