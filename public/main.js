// public/main.js

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const dateInput = document.getElementById('date');
  const taskDayLabel = document.getElementById('task-day-label');

  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;

  function loadTasks(date) {
    fetch(`/api/tasks?date=${date}`)
      .then(res => res.json())
      .then(tasks => {
        taskList.innerHTML = '';
        taskDayLabel.textContent = `Tasks for ${date}`;
        tasks.forEach(task => {
          const li = document.createElement('li');
          li.className = task.is_done ? 'done' : '';
          li.innerHTML = `
            <span>${task.title} - ${task.description}</span>
            ${!task.is_done ? `<button data-id="${task.id}">✔</button>` : ''}
          `;
          taskList.appendChild(li);
        });
      });
  }

  // Add new task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = dateInput.value;

    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, date })
    })
    .then(() => {
      taskForm.reset();
      dateInput.value = date;
      loadTasks(date);
    });
  });

  // Handle "mark as done"
  taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.dataset.id;
      fetch(`/api/tasks/${id}`, {
        method: 'PUT'
      }).then(() => {
        loadTasks(dateInput.value);
      });
    }
  });

  // Load tasks for the selected date
  dateInput.addEventListener('change', () => {
    loadTasks(dateInput.value);
  });

  loadTasks(today);
});
