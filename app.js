const list = document.getElementById('todo-list');
const select = document.getElementById('user-todo');
document.addEventListener('DOMContentLoaded', loadTodos);
document.querySelector('button').addEventListener('click', handleClick);

async function loadTodos() { // загрузка страницы
    try {
        const dataUsers = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await dataUsers.json();

        users.forEach( async(user) => {
            const userName = user.name;
            const userId = user.id;
            const dataTodos = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);
            const todos = await dataTodos.json();
            todos.forEach(todo => {
                createTodos(todo, userName);
            });
            createUserList(user.name);
        });
    } catch(e) {
        alert('Ошибка загрузки с сервера: ' + e);
    };
};

async function handleClick(event) { // добавление задачи по кнопки
    try {
        event.preventDefault();

        const dataUsers = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await dataUsers.json();
    
        const userName = select.value;
        const user = users.find( el => el.name === userName);

        const todoTitle = document.getElementById('new-todo').value;
        const userLastId = users.pop().id;

        const dataTodos = await fetch(`https://jsonplaceholder.typicode.com/users/${userLastId}/todos`);
        const todos = await dataTodos.json();
        const todoId = todos.pop().id;
    
        await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/todos`, {
            method: 'POST',
            body: JSON.stringify({
                userId: user.id,
                id: todoId + 1,
                title: todoTitle,
                completed: false,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => createTodos(json, userName));  
    } catch (e) {
        alert('Ошибка добавления задачи: ' + e);
    };
};

function createTodos(todo, user) { // прорисовка элементов
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const closeBtn = document.createElement('div');

    closeBtn.className = 'close';
    closeBtn.innerHTML = 'x';
    closeBtn.addEventListener('click', () => {deleteTask(todo, li)})

    checkbox.type = 'checkbox';
    if(todo.completed) {
        checkbox.checked = true;
    }
    checkbox.id = todo.id;
    checkbox.addEventListener('click', () => {updateTask(todo, checkbox)});

    label.htmlFor = todo.id;
    label.innerHTML = todo.title + ' by ' + user;

    li.className = 'todo-item';
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(closeBtn);

    list.prepend(li);
};

function createUserList(userName) { // создание выпадающего списка из пользователей
    const option = document.createElement('option');
    option.value = userName;
    option.innerHTML = userName;
    select.prepend(option);
};

async function updateTask(todo, checkbox) { // обновление задачи
    try {

        if(checkbox.checked) {
            todo.completed = true;
        } else {
            todo.completed = false;
        }

        await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                completed: todo.completed,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    } catch (e) {
        alert('Ошибка обновления задачи: ' + e);
    };
};

async function deleteTask(todo, li) { // удаление элемента
    try {
        await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
            method: 'DELETE',
        })
        li.remove();
    } catch (error) {
        alert('Ошибка удаления: ' + e);
    };
};