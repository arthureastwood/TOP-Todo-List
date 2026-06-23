export class Todo {
    constructor(title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
    renderTodos(){
        const todos = [];
        const todoTitle = document.getElementById('todo-title').value;
        const todoDescription = document.getElementById('todo-desc').value;
        const todoDate = document.getElementById('todo-date').value;
        const todoPriority = document.getElementById('todo-priority').checked;
        const addTaskBtn = document.getElementById('add-todo-btn');
        const todoList = document.getElementById('todo-list');
        addTaskBtn.addEventListener('submit', function(){
            todos.push(todoTitle, todoDescription, todoDate, todoPriority);
            todos.forEach(todo => {
                const todoTitleRender = document.createElement('h4');
                const todoDescriptionRender = document.createElement('p');
                const todoDateRender = document.createElement('p');
                const todoPriorityRender = document.createElement('p');
                this.title = todo.todoTitle = todoTitleRender;
                this.description = todo.todoDescription = todoDescriptionRender;
                this.dueDate = todo.todoDate = todoDateRender;
                this.priority = todo.todoPriority = todoPriorityRender;
                
            });
            
        });
    }
}