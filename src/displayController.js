import './styles.css';

export class DisplayController{
    initDisplay(){
        const appContainer = document.getElementById('app-container');
        appContainer.innerHTML = `
            <!-- Sidebar for Projects -->
            <aside class="sidebar">
                <h2>Projects</h2>
                <ul id="project-list"></ul>
                <form id="add-project-form">
                    <input type="text" id="new-project-title" placeholder="New Project Name" required>
                    <button id="add-project-btn" type="submit">Add</button>
                </form>
            </aside>

            <!-- Main Content Area -->
            <main class="main-content">
                <header class="main-header">
                    <h1 id="current-project-title">Default Project</h1>
                </header>

                <div id="new-todo-container">
                    <button id="new-todo-btn">New Todo</button>
                </div>

                <!-- Todo Items List -->
                <section class="todo-list-section">
                    <ul id="todo-list"></ul>
                </section>
            </main>
        `;
        const newTodoBtn = document.getElementById('new-todo-btn').addEventListener('click', function(){
            const newTodoFormSection = document.createElement('div');
            newTodoFormSection.classList.add('todo-form-section');
            newTodoFormSection.innerHTML = `
                <form id="add-todo-form">
                    <input type="text" id="todo-title" placeholder="Task Title" required>
                    <input type="text" id="todo-desc" placeholder="Description">
                    <input type="date" id="todo-date" required>
                    <select id="todo-priority">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <button id="add-todo-btn" type="submit">Add Task</button>
                </form>
            `;
        });
    }
}