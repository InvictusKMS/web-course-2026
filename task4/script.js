'use strict';
let secret = '';
let attempts = [];
let gameOver = false;
const form = document.querySelector('#guess-form');
const input = document.querySelector('#guess-input');
const feedback = document.querySelector('#feedback');
const history = document.querySelector('#history');
const checkButton = document.querySelector('#check');

function generateNumber() {
  // Частичное перемешивание Фишера–Йетса: выбранные цифры не повторяются.
  const digits = ['0','1','2','3','4','5','6','7','8','9'];
  for (let i = 0; i < 4; i++) {
    const j = i + Math.floor(Math.random() * (digits.length - i));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, 4).join('');
}
function validateGuess(value) {
  if (!/^[0-9]{4}$/.test(value)) return 'Введите ровно 4 цифры без пробелов и других символов.';
  if (new Set(value).size !== 4) return 'Цифры не должны повторяться.';
  return '';
}
function countBullsAndCows(target, guess) {
  let bulls = 0;
  let cows = 0;
  [...guess].forEach((digit, index) => {
    if (target[index] === digit) bulls++;
    else if (target.includes(digit)) cows++;
  });
  return { bulls, cows };
}
function render() {
  document.querySelector('#counter').textContent = `Попыток: ${attempts.length}`;
  document.querySelector('#empty').hidden = attempts.length > 0;
  history.replaceChildren();
  attempts.forEach((attempt, index) => {
    const row = document.createElement('li');
    if (attempt.bulls === 4) row.className = 'win';
    const number = document.createElement('span');
    number.className = 'attempt-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const guess = document.createElement('span');
    guess.className = 'guess';
    guess.textContent = attempt.guess;
    const result = document.createElement('span');
    result.className = 'result';
    result.textContent = `● ${attempt.bulls} / ○ ${attempt.cows}`;
    result.setAttribute('aria-label', `Быков: ${attempt.bulls}, коров: ${attempt.cows}`);
    row.append(number, guess, result);
    history.append(row);
  });
  input.disabled = gameOver;
  checkButton.disabled = gameOver;
}
function newGame() {
  secret = generateNumber();
  attempts = [];
  gameOver = false;
  input.value = '';
  input.removeAttribute('aria-invalid');
  feedback.textContent = '';
  feedback.classList.remove('success');
  render();
  input.focus();
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (gameOver) return;
  const guess = input.value;
  const error = validateGuess(guess);
  if (error) {
    feedback.textContent = error;
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  input.removeAttribute('aria-invalid');
  const result = countBullsAndCows(secret, guess);
  attempts.push({ guess, ...result });
  gameOver = result.bulls === 4;
  render();
  if (gameOver) {
    feedback.textContent = `Победа! Угадано за ${attempts.length} попыток. Число: ${secret}.`;
    feedback.classList.add('success');
    document.querySelector('#new-game').focus();
  } else {
    feedback.textContent = `Быков: ${result.bulls}, коров: ${result.cows}. Продолжайте!`;
    input.select();
  }
});
document.querySelector('#new-game').addEventListener('click', newGame);
input.addEventListener('input', () => { feedback.textContent = ''; input.removeAttribute('aria-invalid'); });
newGame();
