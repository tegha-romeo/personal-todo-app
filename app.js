// app.js
const express = require('express');
const path = require('path');
const db = require('./db/database');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Get all tasks for a specific date
app.get('/api/tasks', (req, res) => {
  const date = req.query.date;
  const tasks = db.getTasksByDate(date);
  res.json(tasks);
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, date } = req.body;
  const newTask = db.addTask(title, description, date);
  res.status(201).json(newTask);
});

// Update task as done
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updated = db.markTaskAsDone(id);
  res.json({ success: updated });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// DELETE task by ID
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const success = db.deleteTask(id);
  res.json({ success });
});

