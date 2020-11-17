'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('ToDoList')));
    }

    addToStorage() {
        localStorage.setItem('ToDoList', JSON.stringify([...this.todoData]));  //делаем из коллекции массив с помощью Spread оператора
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();

    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.completed = todo.completed;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);

        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value === '') {
            alert('Пустую строку добавить нельзя!');
            return;
        }
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        }
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(target) {
        this.todoData.forEach((item) => {
            if (item.key === target.key) {
                this.todoData.delete(target.key);
            }
        });
        this.render();
    }

    completedItem(target) {
        this.todoData.forEach((item) => {
            if (item.key === target.key) {
                this.todoData.delete(target.key);
            }
        });
        const newTodo = {
            value: target.childNodes[1].textContent,
            completed: !target.completed,
            key: target.key
        };
        this.todoData.set(newTodo.key, newTodo);
        this.render();
    }

    handler() {
        const todoContainer = document.querySelector('.todo-container');
        todoContainer.addEventListener('click', (event) => {
            let target = event.target;
            if (target.matches('.todo-complete')) {
                target = target.closest('.todo-item');
                this.completedItem(target);
            }
            if (target.matches('.todo-remove')) {
                target = target.closest('.todo-item');
                this.deleteItem(target);
            }
        });
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.handler();
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
