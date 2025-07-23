// public/main.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const tbody = document.querySelector('#task-table tbody');
  const dateInput = document.getElementById('date');

  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;

  async function loadTasks(date) {
    const res = await fetch(`/api/tasks?date=${date}`);
    const tasks = await res.json();
    tbody.innerHTML = '';
    tasks.forEach(t => addRow(t));
  }

  function addRow(task) {
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
      </td>`;
    tbody.appendChild(tr);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const newTask = {
      title: form.title.value,
      description: form.description.value,
      date: form.date.value
    };
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(newTask)
    });
    const saved = await res.json();
    addRow(saved);
    form.reset();
    form.date.value = today;
  });

  tbody.addEventListener('click', async e => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains('done-btn')) {
      await fetch(`/api/tasks/${id}`, { method: 'PUT' });
      loadTasks(dateInput.value);
    }

    if (e.target.classList.contains('delete-btn')) {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      loadTasks(dateInput.value);
    }
  });

  dateInput.addEventListener('change', () => loadTasks(dateInput.value));

  loadTasks(today);
});
