document.addEventListener('DOMContentLoaded', function () {
  let tasks = [];
  let nextId = 1;
  let currentFilter = 'all';

  function isVisible(task) {
    if (currentFilter === 'active') {
      return !task.completed;
    }

    if (currentFilter === 'completed') {
      return task.completed;
    }

    return true;
  }

  function changeTask(task, checkbox) {
    task.completed = checkbox.checked;
    render();

    const list = document.querySelector('#task-list');
    const newCheckbox = list.querySelector(
      'input[data-id="' + task.id + '"]'
    );

    if (newCheckbox) {
      newCheckbox.focus();
    } else {
      const filters = document.querySelectorAll('[data-filter]');

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

    const feedback = document.querySelector('#feedback');
    const input = document.querySelector('#task-input');

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
    const list = document.querySelector('#task-list');
    const counter = document.querySelector('#counter');
    const empty = document.querySelector('#empty');
    const filters = document.querySelectorAll('[data-filter]');

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

    const input = document.querySelector('#task-input');
    const feedback = document.querySelector('#feedback');
    const completedInput = document.querySelector('#task-completed');

    const text = input.value.trim();

    if (text === '') {
      feedback.textContent = 'Введите текст задачи.';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }

    const task = {
      id: nextId,
      text: text,
      completed: completedInput.checked,
      name: 'без имени1'
    };

    tasks.push(task);
    nextId++;

    input.value = '';
    completedInput.checked = false;
    input.removeAttribute('aria-invalid');

    if (isVisible(task)) {
      feedback.textContent = 'Задача добавлена.';
    } else {
      feedback.textContent =
        'Задача добавлена. Чтобы увидеть её, выберите фильтр «Все».';
    }

    render();
    input.focus();
  }

  function setupEvents() {
    const form = document.querySelector('#task-form');
    const filters = document.querySelectorAll('[data-filter]');
    const input = document.querySelector('#task-input');

    form.addEventListener('submit', addTask);

    for (const button of filters) {
      button.addEventListener('click', function () {
        const feedback = document.querySelector('#feedback');

        currentFilter = button.dataset.filter;
        feedback.textContent = '';
        render();
      });
    }

    input.addEventListener('input', function () {
      const feedback = document.querySelector('#feedback');

      feedback.textContent = '';
      input.removeAttribute('aria-invalid');
    });
  }

  setupEvents();
  render();
});