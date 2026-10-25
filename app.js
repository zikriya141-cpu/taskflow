// Day 1: Basic Frontend Event Listener
// Note: Backend API and SQLite database integration will be added on Day 2.

const taskForm = document.getElementById('task-form');

taskForm.addEventListener('submit', function (event) {
  event.preventDefault();
  alert('Task form submitted! Backend API connection will be implemented in Milestone 2.');
});