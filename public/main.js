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
 function loadTasks(date) {
  fetch(`/api/tasks?date=${date}`)
    .then(res => res.json())
    .then(tasks => {
      const tbody = document.querySelector('#task-table tbody');
      tbody.innerHTML = '';

      tasks.forEach(task => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${task.id}</td>
          <td>${task.title}</td>
          <td>${task.description}</td>
          <td>${task.date}</td>
          <td>${task.is_done ? '✅' : '❌'}</td>
          <td>
            ${!task.is_done ? `<button class="done-btn" data-id="${task.id}">✔️</button>` : ''}
            <button class="delete-btn" data-id="${task.id}">🗑️</button>
          </td>
        `;

        tbody.appendChild(tr);
      });
    });
}

});
document.querySelector('#task-table tbody').addEventListener('click', (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains('done-btn')) {
    fetch(`/api/tasks/${id}`, {
      method: 'PUT'
    }).then(() => {
      loadTasks(document.getElementById('date').value);
    });
  }

  if (e.target.classList.contains('delete-btn')) {
    fetch(`/api/tasks/${id}`, {
      method: 'DELETE'
    }).then(() => {
      loadTasks(document.getElementById('date').value);
    });
  }
});
