let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentSort = "none";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const toDoSort = document.getElementById("sortToDo").value;
  const doneSort = document.getElementById("sortDone").value;

  const toDoList = document.getElementById("toDoList");
  const doneList = document.getElementById("doneList");
  toDoList.innerHTML = "";
  doneList.innerHTML = "";

  const toDoTasks = tasks.filter(task => !task.completed);
  const doneTasks = tasks.filter(task => task.completed);

  const sortedToDo = sortTaskList(toDoTasks, toDoSort);
  const sortedDone = sortTaskList(doneTasks, doneSort);

  sortedToDo.forEach((task, index) => {
    const li = createTaskElement(task, index);
    toDoList.appendChild(li);
  });

  sortedDone.forEach((task, index) => {
    const li = createTaskElement(task, index, true);
    doneList.appendChild(li);
  });
}

function sortTaskList(taskList, sortBy) {
  const sorted = [...taskList];
  if (sortBy === "priority-asc") {
    sorted.sort((a, b) => getPriorityValue(a.priority) - getPriorityValue(b.priority));
  } else if (sortBy === "priority-desc") {
    sorted.sort((a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority));
  } else if (sortBy === "category") {
    sorted.sort((a, b) => a.category.localeCompare(b.category));
  } else {
    sorted.sort((a, b) => a.createdAt - b.createdAt);
  }
  return sorted;
}

function createTaskElement(task, originalIndex, isCompleted = false) {
  const li = document.createElement("li");
  li.className = `list-group-item todo-item d-flex justify-content-between align-items-center ${isCompleted ? "completed text-muted" : ""}`;

  const index = tasks.findIndex(t => t.createdAt === task.createdAt);

  const iconClass = isCompleted ? "fas fa-undo" : "fas fa-check";
  const iconTitle = isCompleted ? "Mark as Incomplete" : "Mark as Complete";

  let actionsHTML = `
    <button class="btn btn-sm btn-${isCompleted ? "secondary" : "success"} me-2" title="${iconTitle}" onclick="toggleTask(${index})">
      <i class="${iconClass}"></i>
    </button>
  `;

  if (!isCompleted) {
    actionsHTML += `
      <button class="btn btn-sm btn-warning me-2" title="Edit Task" onclick="editTask(${index})">
        <i class="fas fa-edit"></i>
      </button>
    `;
  }

  actionsHTML += `
    <button class="btn btn-sm btn-danger" title="Delete Task" onclick="deleteTask(${index})">
      <i class="fas fa-trash"></i>
    </button>
  `;

  li.innerHTML = `
    <div>
      <span class="priority-${task.priority}">[${task.priority}]</span>
      <strong>${task.category}</strong> - 
      <span>${task.text}</span>
      ${task.description ? `<div class="text-muted small">${task.description}</div>` : ""}
    </div>
    <div>${actionsHTML}</div>
  `;

  return li;
}


function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("categoryInput").value.trim();
  const priority = document.getElementById("priorityInput").value;
  const description = document.getElementById("descInput").value.trim();

  if (!text || !category) {
    alert("Task and category are required.");
    return;
  }

  tasks.push({
    text,
    category,
    priority,
    description,
    completed: false,
    createdAt: Date.now(),
  });

  saveTasks();
  renderTasks();

  document.getElementById("taskInput").value = "";
  document.getElementById("categoryInput").value = "";
  document.getElementById("priorityInput").value = "Medium";
  document.getElementById("descInput").value = "";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const task = tasks[index];

  const newText = prompt("Edit Task", task.text);
  if (newText === null || newText.trim() === "") return;

  const newCategory = prompt("Edit Category", task.category);
  if (newCategory === null || newCategory.trim() === "") return;

  const newPriority = prompt("Edit Priority (Low, Medium, High)", task.priority);
  const validPriorities = ["Low", "Medium", "High"];
  if (newPriority === null || !validPriorities.includes(newPriority)) {
    alert("Invalid priority. Please enter Low, Medium, or High.");
    return;
  }

  const newDesc = prompt("Edit Description", task.description || "");
  if (newDesc === null) return;

  task.text = newText.trim();
  task.category = newCategory.trim();
  task.priority = newPriority;
  task.description = newDesc.trim();

  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function getPriorityValue(priority) {
  switch (priority) {
    case "Low": return 1;
    case "Medium": return 2;
    case "High": return 3;
    default: return 0;
  }
}

function handleSortChange(type) {
  if (type === "todo") {
    currentSort = document.getElementById("sortToDo").value;
  } else if (type === "done") {
    currentSort = document.getElementById("sortDone").value;
  }
  renderTasks();
}

function setPrioritySort(direction) {
  currentSort = direction === "asc" ? "priority-asc" : "priority-desc";
  renderTasks();
}

document.querySelectorAll('.sort-option').forEach(option => {
  option.addEventListener('click', (e) => {
    const selectedValue = e.target.getAttribute('data-value');
    currentSort = selectedValue;

    // Update dropdown label
    const btn = document.getElementById('sortDropdownBtn');
    if (selectedValue === 'priority-asc') {
      btn.textContent = 'Priority: Low → High';
    } else if (selectedValue === 'priority-desc') {
      btn.textContent = 'Priority: High → Low';
    } else if (selectedValue === 'category') {
      btn.textContent = 'Category (A-Z)';
    } else {
      btn.textContent = 'None';
    }

    renderTasks();
  });
});

renderTasks();
