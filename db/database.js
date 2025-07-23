// db/database.js
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'todo.db'));

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    is_done INTEGER DEFAULT 0
  )
`).run();

// Fetch tasks by date
function getTasksByDate(date) {
  return db.prepare('SELECT * FROM tasks WHERE date = ?').all(date);
}

// Add a task
function addTask(title, description, date) {
  const stmt = db.prepare('INSERT INTO tasks (title, description, date) VALUES (?, ?, ?)');
  const info = stmt.run(title, description || '', date);
  return { id: info.lastInsertRowid, title, description, date, is_done: 0 };
}

// Mark task as done
function markTaskAsDone(id) {
  const stmt = db.prepare('UPDATE tasks SET is_done = 1 WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}
function deleteTask(id) {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}


module.exports = {
  getTasksByDate,
  addTask,
  markTaskAsDone,
  deleteTask
};

