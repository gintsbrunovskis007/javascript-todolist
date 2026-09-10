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
const taskTagContainer = document.getElementById("task-tag-container");
const taskTagForm = document.getElementById("task-tag-form");
const taskTagInput = document.getElementById("task-tag-input");
const taskTagList = document.getElementById("task-tag-list");
const taskTagCreateButton = document.getElementById("task-tag-create-button");
const taskFilterBySelect = document.getElementById("task-filter-by-select");
const taskFilterSpecificSelect = document.getElementById(
  "task-filter-specific-select",
);
const taskFilterSpecificContainer = document.getElementById(
  "task-filter-specific-container",
);
const filteredTaskList = document.getElementById("filtered-task-list");

let editingTask = null;
let editingCategory = null;
let editingTag = null;

let selectedTagsArray = [];
let selectedFilterTagsArray = [];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let categories = JSON.parse(localStorage.getItem("categories"));

let tags = JSON.parse(localStorage.getItem("tags"));

if (!categories) {
  categories = ["Finance", "Work", "Personal"];
  saveCategories();
}

if (!tags) {
  tags = ["JavaScript", "Python", "Java"];
  saveTags();
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

  const categoryText = document.createElement("span");
  categoryText.textContent = task.category;

  const tagText = document.createElement("span");
  tagText.textContent = task.selectedTags;

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
  li.append(categoryText);
  li.append(tagText);

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

    selectedTagsArray = [...task.selectedTags];

    document
      .querySelectorAll("#task-tag-container button")
      .forEach((button) => {
        button.classList.toggle(
          "selected",
          selectedTagsArray.includes(button.textContent),
        );
      });
  });
  if (!task.completed) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    li.appendChild(checkbox);

    checkbox.addEventListener("change", () => {
      task.completed = true;

      editingTask = null;
      taskForm.reset();
      taskCreateButton.textContent = "Create";

      saveTasks();
      renderTasks();
    });
  }

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

function filterTasksByTags(filterMode) {
  filteredTaskList.innerHTML = "";

  let filteredTasks;

  if (filterMode === "OR") {
    filteredTasks = tasks.filter((task) =>
      selectedFilterTagsArray.some((tag) => task.selectedTags.includes(tag)),
    );
  } else {
    filteredTasks = tasks.filter((task) =>
      selectedFilterTagsArray.every((tag) => task.selectedTags.includes(tag)),
    );
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    filteredTaskList.appendChild(li);
  });
}

function renderFilterSelect() {
  taskFilterSpecificContainer.innerHTML = "";
  taskFilterSpecificSelect.innerHTML = "";

  taskFilterSpecificContainer.classList.add("hidden");
  taskFilterSpecificSelect.classList.remove("hidden");

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "-";

  const priorityOption = document.createElement("option");
  priorityOption.textContent = "Priority";

  const dueDateOption = document.createElement("option");
  dueDateOption.textContent = "Due Date";

  const categoryOption = document.createElement("option");
  categoryOption.textContent = "Category";

  const tagsOption = document.createElement("option");
  tagsOption.textContent = "Tags";

  taskFilterBySelect.appendChild(defaultOption);

  taskFilterBySelect.appendChild(priorityOption);
  taskFilterBySelect.appendChild(dueDateOption);
  taskFilterBySelect.appendChild(categoryOption);
  taskFilterBySelect.appendChild(tagsOption);

  taskFilterBySelect.addEventListener("change", () => {
    taskFilterSpecificContainer.innerHTML = "";
    taskFilterSpecificSelect.innerHTML = "";

    taskFilterSpecificContainer.classList.add("hidden");
    taskFilterSpecificSelect.classList.remove("hidden");

    filterByOption = taskFilterBySelect.value;

    if (filterByOption == priorityOption.value) {
      const defaultPriorityOption = document.createElement("option");
      defaultPriorityOption.textContent = "-";

      const highOption = document.createElement("option");
      highOption.text = "High";

      const mediumOption = document.createElement("option");
      mediumOption.text = "Medium";

      const lowOption = document.createElement("option");
      lowOption.text = "Low";

      taskFilterSpecificSelect.appendChild(defaultPriorityOption);
      taskFilterSpecificSelect.appendChild(highOption);
      taskFilterSpecificSelect.appendChild(mediumOption);
      taskFilterSpecificSelect.appendChild(lowOption);

      taskFilterSpecificSelect.addEventListener("change", () => {
        renderFilterPriority();
      });
    } else if (filterByOption == categoryOption.value) {
      filteredTaskList.innerHTML = "";
      const defaultCategoryOption = document.createElement("option");
      defaultCategoryOption.textContent = "-";
      taskFilterSpecificSelect.appendChild(defaultCategoryOption);
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.textContent = category;
        taskFilterSpecificSelect.appendChild(option);
      });

      const tasksArray = [...tasks];
      let filteredTaskArray = [];

      taskFilterSpecificSelect.addEventListener("change", () => {
        filteredTaskList.innerHTML = "";

        categories.forEach((category) => {
          if (category === taskFilterSpecificSelect.value) {
            filteredTaskArray = tasksArray.filter(
              (task) => task.category === category,
            );

            filteredTaskArray.forEach((task) => {
              const li = document.createElement("li");
              li.textContent = task.text;
              const span = document.createElement("span");
              span.textContent = task.category;
              li.appendChild(span);
              filteredTaskList.append(li);
            });
          }
        });
      });
    } else if (filterByOption == tagsOption.value) {
      const andRadioButton = document.createElement("input");
      andRadioButton.type = "radio";
      andRadioButton.name = "filter";
      andRadioButton.value = "AND";

      const andLabel = document.createElement("label");
      andLabel.textContent = "AND";
      andLabel.prepend(andRadioButton);

      const orRadioButton = document.createElement("input");
      orRadioButton.type = "radio";
      orRadioButton.name = "filter";
      orRadioButton.value = "OR";

      const orLabel = document.createElement("label");
      orLabel.textContent = "OR";
      orRadioButton.checked = true;
      orLabel.prepend(orRadioButton);

      taskFilterSpecificContainer.appendChild(orLabel);
      taskFilterSpecificContainer.appendChild(andLabel);

      andRadioButton.addEventListener("change", () => {
        filterTasksByTags("AND");
      });

      orRadioButton.addEventListener("change", () => {
        filterTasksByTags("OR");
      });

      tags.forEach((tag) => {
        const button = document.createElement("button");
        button.textContent = tag;
        button.type = "button";
        button.addEventListener("click", () => {
          if (selectedFilterTagsArray.includes(tag)) {
            selectedFilterTagsArray = selectedFilterTagsArray.filter(
              (t) => t !== tag,
            );
            button.classList.remove("selected");
          } else {
            selectedFilterTagsArray.push(tag);
            button.classList.add("selected");
          }

          console.log(selectedFilterTagsArray);

          const filterMode = document.querySelector(
            'input[name="filter"]:checked',
          ).value;

          let filteredTasks;

          if (filterMode === "OR") {
            filteredTasks = tasks.filter((task) =>
              selectedFilterTagsArray.some((tag) =>
                task.selectedTags.includes(tag),
              ),
            );
          } else {
            filteredTasks = tasks.filter((task) =>
              selectedFilterTagsArray.every((tag) =>
                task.selectedTags.includes(tag),
              ),
            );
          }

          filteredTaskList.innerHTML = "";

          filteredTasks.forEach((task) => {
            const li = document.createElement("li");
            li.textContent = task.text;
            filteredTaskList.appendChild(li);
          });
        });
        taskFilterSpecificContainer.appendChild(button);
        taskFilterSpecificContainer.classList.remove("hidden");
        taskFilterSpecificSelect.classList.add("hidden");
      });
    } else if (filterByOption == dueDateOption.value) {
      taskFilterSpecificContainer.classList.remove("hidden");
      taskFilterSpecificSelect.classList.add("hidden");

      const dateInput = document.createElement("input");
      dateInput.type = "date";

      taskFilterSpecificContainer.appendChild(dateInput);

      dateInput.addEventListener("change", () => {
        filteredTaskList.innerHTML = "";

        const filteredTasks = tasks.filter(
          (task) =>
            new Date(task.dueDate).toISOString().split("T")[0] ===
            dateInput.value,
        );

        filteredTasks.forEach((task) => {
          const li = document.createElement("li");
          li.textContent = task.text;

          filteredTaskList.appendChild(li);
        });
      });
    }
  });
}

function renderFilterPriority() {
  if (taskFilterSpecificSelect.value === "High") {
    filteredTaskList.innerHTML = "";

    const tasksArray = [...tasks];
    const filteredTasks = tasksArray.filter((task) => task.priority === "high");

    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.textContent = task.text;
      filteredTaskList.appendChild(li);
    });
  } else if (taskFilterSpecificSelect.value === "Medium") {
    filteredTaskList.innerHTML = "";
    const tasksArray = [...tasks];
    const filteredTasks = tasksArray.filter(
      (task) => task.priority === "medium",
    );

    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.textContent = task.text;
      filteredTaskList.appendChild(li);
    });
  } else if (taskFilterSpecificSelect.value === "Low") {
    filteredTaskList.innerHTML = "";
    const tasksArray = [...tasks];
    const filteredTasks = tasksArray.filter((task) => task.priority === "low");

    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.textContent = task.text;
      filteredTaskList.appendChild(li);
    });
  }
}

function createTaskTagElement(tag, index) {
  const li = document.createElement("li");

  li.textContent = tag;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", () => {
    tags.splice(index, 1);
    saveTags();
    renderTags();
  });

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";

  editButton.addEventListener("click", () => {
    editingTag = tag;
    taskTagInput.value = tag;
    taskTagCreateButton.textContent = "Update";
  });

  li.append(deleteButton);
  li.append(editButton);

  return li;
}

function saveTags() {
  localStorage.setItem("tags", JSON.stringify(tags));
}

function renderTags() {
  taskTagList.innerHTML = "";
  tags.forEach((tag, index) => {
    const li = createTaskTagElement(tag, index);
    taskTagList.appendChild(li);
  });
}

function renderTaskTags() {
  taskTagContainer.innerHTML = "";
  tags.forEach((tag) => {
    const button = document.createElement("button");
    button.textContent = tag;
    button.type = "button";
    button.addEventListener("click", () => {
      if (selectedTagsArray.includes(tag)) {
        selectedTagsArray = selectedTagsArray.filter((t) => t !== tag);
        button.classList.remove("selected");
      } else {
        selectedTagsArray.push(tag);
        button.classList.add("selected");
      }
    });
    taskTagContainer.append(button);
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
renderTags();
renderTaskTags();
renderFilterSelect();

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskInputValue = taskInput.value.trim();
  const taskPrioritySelectValue = taskPrioritySelect.value;

  if (taskDueDateInput.value === "") {
    alert("Date cannot be empty.");
    return;
  }
  const taskDueDateValue = new Date(taskDueDateInput.value);

  const taskCategorySelectValue = taskCategorySelect.value;

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const isOverDue = taskDueDateValue < todayDate;

  if (taskInputValue === "") {
    alert("Task cannot be empty.");
    return;
  }

  if (taskInputValue.length > 100) {
    alert("Task cannot exceed 100 characters.");
    return;
  }

  if (editingTask) {
    editingTask.text = taskInputValue;
    editingTask.priority = taskPrioritySelectValue;
    editingTask.dueDate = taskDueDateValue;
    editingTask.overDue = isOverDue;
    editingTask.category = taskCategorySelectValue;
    editingTask.selectedTags = selectedTagsArray;
    editingTask = null;
    selectedTagsArray = [];
    saveTasks();
    renderTasks();
    renderTaskTags();
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
    selectedTags: selectedTagsArray,
    completed: false,
  };

  tasks.push(task);
  selectedTagsArray = []
  saveTasks();
  renderTasks();
  renderTaskTags();
  renderFilterPriority();
  taskForm.reset();
});

taskCategoryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskCategoryInputValue = taskCategoryInput.value;

  const category = taskCategoryInputValue;

  if (category === "") {
    alert("Category cannot be empty.");
    return;
  }

  if (category > 100) {
    alert("Category cannot exceed 100 characters.");
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

taskTagForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskTagInputValue = taskTagInput.value;

  const tag = taskTagInputValue;

  if (tag === "") {
    alert("Tag cannot be empty.");
    return;
  }

  if (tag > 100) {
    alert("Tag cannot exceed 100 characters.");
    return;
  }

  if (editingTag) {
    const index = tags.indexOf(editingTag);
    tags[index] = taskTagInputValue;

    taskTagCreateButton.textContent = "Create";

    editingTag = null;
    saveTags();
    renderTags();
    taskTagForm.reset();

    return;
  }

  tags.push(tag);
  saveTags();
  renderTags();
  taskTagForm.reset();
});
