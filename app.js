const todoList = document.querySelector('.todo-list')
const todoForm = document.querySelector('.todo-form')
const todoInput = document.querySelector('.todo-input')

todoForm.addEventListener('submit', onAddTodo)

async function onAddTodo(e) {
    e.preventDefault()
    
    if (!todoInput.value) return

    const response = await fetch('http://localhost:4000/todos', {
        method: 'POST',
        body: JSON.stringify({ title: todoInput.value }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    const data = await response.json()

    const todoItem = createTodoItem(data.todo)

    todoList.appendChild(todoItem)
    todoInput.value = ''
}

async function onMarkTodoAsComplete(e) {
    const todoItem = e.target.parentNode
    const todoId = todoItem.dataset.todoId
    const completed = todoItem.classList.contains('completed')

    await fetch(`http://localhost:4000/todos/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !completed }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    todoItem.classList.toggle('completed')
}

async function onRemoveTodo(e) {
    const todoItem = e.target.parentNode
    const todoId = todoItem.dataset.todoId

    await fetch(`http://localhost:4000/todos/${todoId}`, {
        method: 'DELETE'
    })

    todoItem.remove()
}

function createTodoCompleteButton() {
    const btnTodoComplete = document.createElement('button')
    const icon = document.createElement('i')

    icon.classList.add('fas', 'fa-check')
    btnTodoComplete.classList.add('btn-todo-complete')

    btnTodoComplete.appendChild(icon)
    return btnTodoComplete
}

function createTodoRemoveButton() {
    const btnTodoRemove = document.createElement('button')
    const icon = document.createElement('i')

    icon.classList.add('fas', 'fa-trash')
    btnTodoRemove.classList.add('btn-todo-remove')

    btnTodoRemove.appendChild(icon)
    return btnTodoRemove
}

function createTodoItem(todo) {
    const todoItem = document.createElement('div')
    const todoTitle = document.createElement('p')
    const btnTodoComplete = createTodoCompleteButton()
    const btnTodoRemove = createTodoRemoveButton()

    if (todo.completed) todoItem.classList.add('completed')
    todoItem.classList.add('todo-item')
    todoTitle.classList.add('todo-title')

    todoTitle.innerText = todo.title

    todoItem.dataset.todoId = todo.id

    todoItem.appendChild(todoTitle)
    todoItem.appendChild(btnTodoComplete)
    todoItem.appendChild(btnTodoRemove)

    btnTodoComplete.addEventListener('click', onMarkTodoAsComplete)
    btnTodoRemove.addEventListener('click', onRemoveTodo)

    return todoItem
}

async function getTodos() {
    const response = await fetch('http://localhost:4000/todos')
    const todos = await response.json()
    console.debug(todos)
    return todos
}

function createTodoList(todos) {
    todos.forEach((todo) => {
        const todoItem = createTodoItem(todo)
        todoList.appendChild(todoItem)
    })
}

;(async () => {
    const todos = await getTodos()
    createTodoList(todos)
})()