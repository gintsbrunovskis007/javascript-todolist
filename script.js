const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCreateButton = document.getElementById("task-create-button");
const taskList = document.getElementById("task-list");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let taskInputValue = taskInput.value.trim();

  if (taskInputValue === "") {
    return;
  }

  const li = document.createElement("li");
  li.textContent = taskInputValue;

  taskList.appendChild(li);

  taskForm.reset();
});
