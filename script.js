const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let todos = JSON.parse(localStorage.getItem('todos')) || [
  { id: 1, text: 'Вивчити HTML', checked: true },
  { id: 2, text: 'Вивчити CSS', checked: true },
  { id: 3, text: 'Вивчити JavaScript', checked: false }
];

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
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
          onChange="checkTodo(${todo.id})" 
        />
        <label for="todo-${todo.id}" class="w-100 mb-0">
          <span class="todo-text ${todo.checked ? 'checked-todo' : ''}">${todo.text}</span>
        </label>
      </div>
      <button class="btn btn-danger btn-sm px-3" onClick="deleteTodo(${todo.id})">Видалити</button>
    </li>
  `).join('');
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  const uncheckedCount = todos.filter(todo => !todo.checked).length;
  uncheckedCountSpan.textContent = uncheckedCount;
}


function newTodo() {
  const text = prompt('Введіть назву нової справи:');
  if (text && text.trim() !== '') {

    const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    
    todos.push({
      id: newId,
      text: text.trim(),
      checked: false
    });
    
    saveTodos();
    render();
    updateCounter();
  }
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  render();
  updateCounter();
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.checked = !todo.checked;
    saveTodos();
    render();
    updateCounter();
  }
}

render();
updateCounter();