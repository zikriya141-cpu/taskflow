const express = require('express');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = 3000;

// Middleware to read JSON data and serve frontend files from 'public' folder
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Connect to SQLite Database (creates tasks.db automatically)
const dbPath = path.join(__dirname, 'tasks.db');
const db = new DatabaseSync(dbPath);
console.log('Connected to SQLite database (tasks.db).');

// 2. Create the 'tasks' table if it does not exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    due_date TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed initial sample tasks if the database table is empty
const countRow = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();
if (countRow.count === 0) {
  const insertSample = db.prepare(`
    INSERT INTO tasks (title, description, status, due_date)
    VALUES (?, ?, ?, ?)
  `);
  insertSample.run(
    'Design TaskFlow UI Layout',
    'Build a responsive HTML and CSS interface with an Add Task form and sample task cards.',
    'completed',
    '2026-10-26'
  );
  insertSample.run(
    'Build Node.js & SQLite Backend',
    'Set up Express server, create the SQLite tasks table, and test GET and POST endpoints.',
    'pending',
    '2026-10-27'
  );
  insertSample.run(
    'Record Friday Walkthrough Demo',
    'Demonstrate full CRUD operations and explain how frontend communicates with backend API.',
    'pending',
    '2026-10-30'
  );
}

// ==========================================
// REST API ENDPOINTS (CRUD)
// ==========================================

// READ: GET /tasks - Fetch all tasks from the database
app.get('/tasks', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve tasks.' });
  }
});

// CREATE: POST /tasks - Add a new task with input validation
app.post('/tasks', (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;

    // Input Validation: Title cannot be empty
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const cleanTitle = title.trim();
    const cleanDesc = description ? description.trim() : '';
    const cleanStatus = status === 'completed' ? 'completed' : 'pending';
    const cleanDueDate = due_date || '';

    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, status, due_date)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(cleanTitle, cleanDesc, cleanStatus, cleanDueDate);

    res.status(201).json({
      id: Number(result.lastInsertRowid),
      title: cleanTitle,
      description: cleanDesc,
      status: cleanStatus,
      due_date: cleanDueDate
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save task to database.' });
  }
});

// UPDATE: PUT /tasks/:id - Edit task details or toggle status (pending/completed)
app.put('/tasks/:id', (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

    if (!existing) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const updatedTitle = req.body.title !== undefined ? req.body.title.trim() : existing.title;
    if (!updatedTitle) {
      return res.status(400).json({ error: 'Task title cannot be empty.' });
    }

    const updatedDesc = req.body.description !== undefined ? req.body.description.trim() : existing.description;
    const updatedStatus = req.body.status === 'completed' ? 'completed' : (req.body.status === 'pending' ? 'pending' : existing.status);
    const updatedDueDate = req.body.due_date !== undefined ? req.body.due_date : existing.due_date;

    db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, due_date = ?
      WHERE id = ?
    `).run(updatedTitle, updatedDesc, updatedStatus, updatedDueDate, taskId);

    res.json({
      id: taskId,
      title: updatedTitle,
      description: updatedDesc,
      status: updatedStatus,
      due_date: updatedDueDate
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

// DELETE: DELETE /tasks/:id - Delete a task from the database
app.delete('/tasks/:id', (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.', id: taskId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

// Start the Express Server
app.listen(PORT, () => {
  console.log(`TaskFlow server is running at http://localhost:${PORT}`);
});