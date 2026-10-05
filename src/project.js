export class Project{
    constructor(name){
        this.name = name;
        this.todos = [];
        this.id = crypto.randomUUID();
    }
    
    addTodo(todo){
        this.todos.push(todo);
    }
    
    deleteTodo(todoId){
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }

    getTodos(){
        return this.todos;
    }
}