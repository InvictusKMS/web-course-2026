let tasks = [];
let nextId = 1;
let currentFilter = 'all';

// Находим элементы страницы
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const feedback = document.querySelector('#feedback');
const empty = document.querySelector('#empty');
const counter = document.querySelector('#counter');
const filters = document.querySelectorAll('[data-filter]');


function isVisible(task) {
  if (currentFilter === 'active') {
    return !task.completed;
  }

  if (currentFilter === 'completed') {
    return task.completed;
  }

  return true;
}

// Меняем статус задачи
function changeTask(task, checkbox) {
  task.completed = checkbox.checked;
  render();


  const newCheckbox = list.querySelector(
    'input[data-id="' + task.id + '"]'
  );

  if (newCheckbox) {
    newCheckbox.focus();
  } else {
    for (const button of filters) {
      if (button.dataset.filter === currentFilter) {
        button.focus();
      }
    }
  }
}


function deleteTask(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks.splice(i, 1);
      break;
    }
  }

  feedback.textContent = 'Задача удалена.';
  render();
  input.focus();
}


function createTaskElement(task) {
  const row = document.createElement('li');
  row.className = 'task';

  if (task.completed) {
    row.classList.add('completed');
  }

  const label = document.createElement('label');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.dataset.id = task.id;

  checkbox.addEventListener('change', function () {
    changeTask(task, checkbox);
  });

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Удалить';
  removeButton.setAttribute(
    'aria-label',
    'Удалить задачу: ' + task.text
  );

  removeButton.addEventListener('click', function () {
    deleteTask(task.id);
  });

  label.append(checkbox, text);
  row.append(label, removeButton);

  return row;
}


function render() {
  list.replaceChildren();

  let completedCount = 0;
  let visibleCount = 0;

  for (const task of tasks) {
    if (task.completed) {
      completedCount++;
    }

    if (isVisible(task)) {
      const row = createTaskElement(task);
      list.append(row);
      visibleCount++;
    }
  }

  const activeCount = tasks.length - completedCount;

  counter.textContent =
    'Осталось: ' + activeCount +
    ', Выполнено: ' + completedCount;


  empty.hidden = visibleCount > 0;

  if (tasks.length === 0) {
    empty.textContent =
      'Можно начать с малого. Добавьте свою первую задачу.';
  } else {
    empty.textContent = 'В этом фильтре пока нет задач.';
  }

  for (const button of filters) {
    if (button.dataset.filter === currentFilter) {
      button.setAttribute('aria-pressed', 'true');
    } else {
      button.setAttribute('aria-pressed', 'false');
    }
  }
}


function addTask(event) {
  event.preventDefault();

  const text = input.value.trim();

  if (text === '') {
    feedback.textContent =
      'Введите текст задачи — одних пробелов недостаточно.';

    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }

  const task = {
    id: nextId,
    text: text,
    completed: false
  };

  tasks.push(task);
  nextId++;

  input.value = '';
  input.removeAttribute('aria-invalid');

  if (currentFilter === 'completed') {
    feedback.textContent =
      'Задача добавлена. Она видна в фильтре «Активные» или «Все».';
  } else {
    feedback.textContent = 'Задача добавлена.';
  }

  render();
  input.focus();
}

form.addEventListener('submit', addTask);


for (const button of filters) {
  button.addEventListener('click', function () {
    currentFilter = button.dataset.filter;
    feedback.textContent = '';
    render();
  });
}

input.addEventListener('input', function () {
  feedback.textContent = '';
  input.removeAttribute('aria-invalid');
});


render();