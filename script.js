const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCreateButton = document.getElementById("task-create-button");
const activeTaskList = document.getElementById("active-task-list");
const completedTaskList = document.getElementById("completed-task-list");
const activeTaskCountSpan = document.getElementById("active-task-count-span");
const completedTaskCountSpan = document.getElementById(
  "completed-task-count-span",
);
const taskPrioritySelect = document.getElementById("task-priority-select");
const searchTaskInput = document.getElementById("search-task-input");
const searchTaskList = document.getElementById("search-task-list");
const taskDueDateInput = document.getElementById("task-due-date-input");

const deleteAllButton = document.createElement("button");
deleteAllButton.textContent = "Delete all";
deleteAllButton.style.display = "none";

completedTaskCountSpan.parentElement.append(deleteAllButton);

let editingTask = null;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function searchTask(tasks) {
  searchTaskList.innerHTML = "";

  if (tasks.length === 0) {
    searchTaskList.innerHTML = "<p>No tasks found. </p>";
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");

    const date = new Date(task.dueDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    li.textContent = `${task.text} - ${task.priority} - ${date}`;
    searchTaskList.appendChild(li);
  });
}

searchTaskInput.addEventListener("input", () => {
  const query = searchTaskInput.value.toLowerCase().trim();

  if (query === "") {
    searchTaskList.innerHTML = "";
    return;
  }

  const filtered = tasks.filter((task) =>
    task.text.toLowerCase().startsWith(query),
  );
  searchTask(filtered);
});

function checkOverdueTasks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach((task) => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (!task.completed && dueDate < today) {
      task.overDue = true;
    }
  });

  saveTasks();
}

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

  const priorityText = document.createElement("span");
  priorityText.textContent = task.priority;

  const dueDateText = document.createElement("span");
  const date = new Date(task.dueDate);

  dueDateText.textContent = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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

  if (task.overDue) {
    li.classList.add("overdue");
    li.insertAdjacentText("afterbegin", "⚠️ ");
  }

  li.append(priorityText);
  li.append(dueDateText);

  deleteButton.addEventListener("click", () => {
    tasks = tasks.filter((t) => t !== task);
    saveTasks();
    renderTasks();
  });

  editButton.addEventListener("click", () => {
    editingTask = task;
    taskCreateButton.textContent = "Update";
    taskInput.value = task.text;
    taskDueDateInput.value = new Date(task.dueDate).toISOString().split("T")[0];
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

checkOverdueTasks();
renderTasks();

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskInputValue = taskInput.value.trim();
  const taskPrioritySelectValue = taskPrioritySelect.value;
  const taskDueDateValue = new Date(taskDueDateInput.value);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const isOverDue = taskDueDateValue < todayDate;

  if (taskInputValue === "") {
    return;
  }

  if (editingTask) {
    editingTask.text = taskInputValue;
    editingTask.priority = taskPrioritySelectValue;
    editingTask.dueDate = taskDueDateValue;
    editingTask.overDue = isOverDue;
    editingTask = null;

    saveTasks();
    renderTasks();
    taskForm.reset();
    taskCreateButton.textContent = "Create";

    return;
  }

  const task = {
    text: taskInputValue,
    priority: taskPrioritySelectValue,
    dueDate: taskDueDateValue,
    overDue: isOverDue,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
});
