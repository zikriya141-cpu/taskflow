// Frontend JavaScript: Connects UI to Node.js + Express + SQLite API

const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const dueDateInput = document.getElementById('dueDate');
const statusInput = document.getElementById('status');
const taskListEl = document.getElementById('task-list');
const taskCountEl = document.getElementById('task-count');
const feedbackEl = document.getElementById('feedback');
const formHeading = document.getElementById('form-heading');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

let currentTasks = [];
let editingTaskId = null;

// Display success or error feedback banner
function showFeedback(message, type = 'success') {
  feedbackEl.textContent = message;
  feedbackEl.className = 'feedback-msg ' + (type === 'error' ? 'feedback-error' : 'feedback-success');
  setTimeout(() => {
    feedbackEl.className = 'feedback-msg';
  }, 4000);
}

// Safely escape text before rendering in HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

// 1. READ: Fetch all tasks from GET /tasks
async function loadTasks() {
  try {
    const response = await fetch('/tasks');
    if (!response.ok) {
      throw new Error('Could not load tasks from server.');
    }
    currentTasks = await response.json();
    renderTasks();
  } catch (error) {
    taskListEl.innerHTML = '<div class="empty-state">Error loading tasks. Please make sure the server is running.</div>';
    showFeedback(error.message, 'error');
  }
}

// Render the task list in the UI
function renderTasks() {
  taskCountEl.textContent = currentTasks.length + (currentTasks.length === 1 ? ' Task' : ' Tasks');

  if (currentTasks.length === 0) {
    taskListEl.innerHTML = '<div class="empty-state">No tasks found. Add your first task using the form!</div>';
    return;
  }

  taskListEl.innerHTML = currentTasks.map(task => {
    const isCompleted = task.status === 'completed';
    const statusClass = isCompleted ? 'status-completed' : 'status-pending';
    const statusLabel = isCompleted ? 'Completed' : 'Pending';
    const toggleLabel = isCompleted ? 'Mark Pending' : 'Complete';
    const titleClass = isCompleted ? 'task-title-completed' : '';
    const dueText = task.due_date ? 'Due: ' + escapeHtml(task.due_date) : 'No due date';

    return `
      <article class="task-item" data-id="${task.id}">
        <div class="task-info">
          <div class="task-title-row">
            <h3 class="${titleClass}">${escapeHtml(task.title)}</h3>
            <span class="status-badge ${statusClass}">${statusLabel}</span>
          </div>
          <p class="task-desc">${escapeHtml(task.description || 'No description provided.')}</p>
          <span class="task-date">${dueText}</span>
        </div>
        <div class="task-actions">
          <button class="btn-small btn-complete" type="button" data-action="toggle" data-id="${task.id}">${toggleLabel}</button>
          <button class="btn-small btn-edit" type="button" data-action="edit" data-id="${task.id}">Edit</button>
          <button class="btn-small btn-delete" type="button" data-action="delete" data-id="${task.id}">Delete</button>
        </div>
      </article>
    `;
  }).join('');
}

// Reset form back to "Add New Task" mode
function resetFormMode() {
  editingTaskId = null;
  taskForm.reset();
  formHeading.textContent = 'Add New Task';
  submitBtn.textContent = 'Add Task';
  cancelEditBtn.style.display = 'none';
}

// 2. CREATE / UPDATE: Handle form submission (POST /tasks or PUT /tasks/:id)
taskForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const payload = {
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    due_date: dueDateInput.value,
    status: statusInput.value
  };

  if (!payload.title) {
    showFeedback('Task title is required.', 'error');
    titleInput.focus();
    return;
  }

  try {
    if (editingTaskId !== null) {
      // Update existing task (PUT /tasks/:id)
      const response = await fetch(`/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update task.');

      showFeedback('Task updated successfully!', 'success');
      resetFormMode();
    } else {
      // Create new task (POST /tasks)
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save task.');

      showFeedback('Task saved to database successfully!', 'success');
      taskForm.reset();
    }

    await loadTasks();
  } catch (error) {
    showFeedback(error.message, 'error');
  }
});

cancelEditBtn.addEventListener('click', resetFormMode);

// 3. Handle Complete, Edit, and Delete buttons on task cards
taskListEl.addEventListener('click', async function (event) {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;

  const action = btn.getAttribute('data-action');
  const id = Number(btn.getAttribute('data-id'));
  const task = currentTasks.find(t => t.id === id);
  if (!task) return;

  if (action === 'toggle') {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const response = await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status.');
      showFeedback(`Task marked as ${newStatus}!`, 'success');
      await loadTasks();
    } catch (error) {
      showFeedback(error.message, 'error');
    }
  } else if (action === 'edit') {
    editingTaskId = task.id;
    titleInput.value = task.title;
    descInput.value = task.description || '';
    dueDateInput.value = task.due_date || '';
    statusInput.value = task.status;
    formHeading.textContent = 'Edit Task';
    submitBtn.textContent = 'Save Changes';
    cancelEditBtn.style.display = 'inline-block';
    titleInput.focus();
  } else if (action === 'delete') {
    const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete task.');
      if (editingTaskId === id) resetFormMode();
      showFeedback('Task deleted from database.', 'success');
      await loadTasks();
    } catch (error) {
      showFeedback(error.message, 'error');
    }
  }
});

// Load tasks from database when page opens
loadTasks();