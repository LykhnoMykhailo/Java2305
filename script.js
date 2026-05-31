const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');

const FIREBASE_URL = 'https://lab7-5edea-default-rtdb.firebaseio.com/todos';

let todos = [];

function showLoading() { loadingIndicator.classList.remove('d-none'); }
function hideLoading() { loadingIndicator.classList.add('d-none'); }
function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('d-none');
}
function hideError() { errorMessage.classList.add('d-none'); }

function fetchTodos() {
  showLoading();
  hideError();
  
  fetch(`${FIREBASE_URL}.json`)
    .then(response => {
      if (!response.ok) throw new Error('Не вдалося отримати дані з сервера.');
      return response.json();
    })
    .then(data => {
      if (data) {
        todos = Object.keys(data).map(key => ({
          id: key,
          text: data[key].text,
          checked: data[key].checked
        }));
      } else {
        todos = [];
      }
      render();
      updateCounter();
    })
    .catch(error => showError(error.message))
    .finally(() => hideLoading());
}

function newTodo() {
  const text = prompt('Введіть назву нової справи:');
  if (!text || text.trim() === '') return;

  showLoading();
  hideError();

  const newTodoData = {
    text: text.trim(),
    checked: false
  };

  fetch(`${FIREBASE_URL}.json`, {
    method: 'POST',
    body: JSON.stringify(newTodoData),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (!response.ok) throw new Error('Помилка при додаванні запису.');
      return response.json();
    })
    .then(data => {
      todos.push({
        id: data.name, 
        ...newTodoData
      });
      render();
      updateCounter();
    })
    .catch(error => showError(error.message))
    .finally(() => hideLoading());
}

function deleteTodo(id) {
  showLoading();
  hideError();

  fetch(`${FIREBASE_URL}/${id}.json`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) throw new Error('Помилка при видаленні запису.');
      todos = todos.filter(todo => todo.id !== id);
      render();
      updateCounter();
    })
    .catch(error => showError(error.message))
    .finally(() => hideLoading());
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (!todo) return;

  showLoading();
  hideError();

  const updatedStatus = !todo.checked;

  fetch(`${FIREBASE_URL}/${id}.json`, {
    method: 'PATCH',
    body: JSON.stringify({ checked: updatedStatus }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (!response.ok) throw new Error('Помилка при оновленні статусу.');
      todo.checked = updatedStatus;
      render();
      updateCounter();
    })
    .catch(error => showError(error.message))
    .finally(() => hideLoading());
}

function render() {
  list.innerHTML = todos.map(todo => `
    <li class="list-group-item d-flex align-items-center justify-content-between py-3">
      <div class="d-flex align-items-center flex-grow-1">
        <input 
          type="checkbox" 
          class="form-check-input me-3" 
          id="todo-${todo.id}" 
          ${todo.checked ? 'checked' : ''} 
          onChange="checkTodo('${todo.id}')" 
        />
        <label for="todo-${todo.id}" class="w-100 mb-0">
          <span class="todo-text ${todo.checked ? 'checked-todo' : ''}">${todo.text}</span>
        </label>
      </div>
      <button class="btn btn-danger btn-sm px-3" onClick="deleteTodo('${todo.id}')">Видалити</button>
    </li>
  `).join('');
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  const uncheckedCount = todos.filter(todo => !todo.checked).length;
  uncheckedCountSpan.textContent = uncheckedCount;
}

fetchTodos();