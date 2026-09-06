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
const taskCategoryForm = document.getElementById("task-category-form");
const taskCategoryInput = document.getElementById("task-category-input");
const taskCategoryList = document.getElementById("task-category-list");
const taskCategoryCreateButton = document.getElementById(
  "task-category-create-button",
);
const taskCategorySelect = document.getElementById("task-category-select");
const deleteAllButton = document.createElement("button");
deleteAllButton.textContent = "Delete all";
deleteAllButton.style.display = "none";

completedTaskCountSpan.parentElement.append(deleteAllButton);

let editingTask = null;
let editingCategory = null;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let categories = JSON.parse(localStorage.getItem("categories"));

if (!categories) {
  categories = ["Finance", "Work", "Personal"];
  saveCategories();
}

const today = new Date().toISOString().split("T")[0];
taskDueDateInput.value = today;

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

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
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
    taskPrioritySelect.value = task.priority;
    taskCategorySelect.value = task.category;
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

function createCategoryElement(category, index) {
  const li = document.createElement("li");
  li.textContent = category;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";

  li.append(deleteButton);
  li.append(editButton);

  deleteButton.addEventListener("click", () => {
    categories.splice(index, 1);
    saveCategories();
    renderCategories();
    renderCategorySelect();
  });

  editButton.addEventListener("click", () => {
    editingCategory = category;
    taskCategoryCreateButton.textContent = "Update";
    taskCategoryInput.value = category;
  });

  return li;
}

function renderCategories() {
  taskCategoryList.innerHTML = "";

  categories.forEach((category, index) => {
    const li = createCategoryElement(category, index);
    taskCategoryList.appendChild(li);
  });
}

function renderCategorySelect() {
  taskCategorySelect.innerHTML = "";

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;

    taskCategorySelect.appendChild(option);
  });
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
renderCategories();
renderCategorySelect();

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskInputValue = taskInput.value.trim();
  const taskPrioritySelectValue = taskPrioritySelect.value;
  const taskDueDateValue = new Date(taskDueDateInput.value);
  const taskCategorySelectValue = taskCategorySelect.value;

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
    editingTask.category = taskCategorySelectValue;
    editingTask = null;

    saveTasks();
    renderTasks();
    taskForm.reset();
    taskCreateButton.textContent = "Create";

    return;
  }

  const task = {
    id: crypto.randomUUID(),
    text: taskInputValue,
    priority: taskPrioritySelectValue,
    dueDate: taskDueDateValue,
    overDue: isOverDue,
    category: taskCategorySelectValue,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

taskCategoryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskCategoryInputValue = taskCategoryInput.value;

  const category = taskCategoryInputValue;

  if (!category) {
    return;
  }

  if (editingCategory) {
    const index = categories.indexOf(editingCategory);
    categories[index] = taskCategoryInputValue;

    taskCategoryCreateButton.textContent = "Create";
    saveCategories();
    renderCategories();
    renderCategorySelect();

    editingCategory = null;
    taskCategoryForm.reset();

    return;
  }

  categories.push(category);
  saveCategories();
  renderCategories();
  renderCategorySelect();
  taskCategoryForm.reset();
});
