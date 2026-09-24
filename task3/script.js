'use strict';
// Единственный источник данных. Фильтры меняют вид, но не удаляют задачи.
let tasks = [];
let nextId = 1;
let currentFilter = 'all';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const feedback = document.querySelector('#feedback');
const empty = document.querySelector('#empty');
const filters = document.querySelectorAll('[data-filter]');

function render() {
  const completed = tasks.filter(task => task.completed).length;
  document.querySelector('#counter').textContent = `Осталось: ${tasks.length - completed}, Выполнено: ${completed}`;
  list.replaceChildren();
  let visibleCount = 0;
  tasks.forEach(task => {
    const row = document.createElement('li');
    row.className = task.completed ? 'task completed' : 'task';
    row.hidden = (currentFilter === 'active' && task.completed) || (currentFilter === 'completed' && !task.completed);
    if (!row.hidden) visibleCount++;
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.dataset.id = task.id;
    const text = document.createElement('span');
    text.className = 'task-text';
    // textContent не интерпретирует пользовательский текст как HTML.
    text.textContent = task.text;
    label.append(checkbox, text);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Удалить';
    remove.dataset.id = task.id;
    remove.setAttribute('aria-label', `Удалить задачу: ${task.text}`);
    row.append(label, remove);
    list.append(row);
  });
  empty.hidden = visibleCount > 0;
  empty.textContent = tasks.length === 0 ? 'Можно начать с малого. Добавьте свою первую задачу.' : 'В этом фильтре пока нет задач.';
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === currentFilter)));
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    feedback.textContent = 'Введите текст задачи — одних пробелов недостаточно.';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  tasks.push({ id: nextId++, text, completed: false });
  input.value = '';
  input.removeAttribute('aria-invalid');
  feedback.textContent = currentFilter === 'completed' ? 'Задача добавлена. Она видна в фильтре «Активные» или «Все».' : 'Задача добавлена.';
  render();
  input.focus();
});
// Делегирование событий: обработчики установлены на постоянный список.
list.addEventListener('change', event => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const id = Number(event.target.dataset.id);
  tasks = tasks.map(task => task.id === id ? { ...task, completed: event.target.checked } : task);
  render();
  const nextCheckbox = list.querySelector(`input[data-id="${id}"]`);
  if (nextCheckbox && !nextCheckbox.closest('li').hidden) nextCheckbox.focus();
  else document.querySelector(`[data-filter="${currentFilter}"]`).focus();
});
list.addEventListener('click', event => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  tasks = tasks.filter(task => task.id !== Number(button.dataset.id));
  feedback.textContent = 'Задача удалена.';
  render();
  input.focus();
});
filters.forEach(button => button.addEventListener('click', () => {
  currentFilter = button.dataset.filter;
  feedback.textContent = '';
  render();
}));
input.addEventListener('input', () => { feedback.textContent = ''; input.removeAttribute('aria-invalid'); });
render();
