import { format } from 'date-fns';

export class DisplayController {
  constructor(logic) {
    this.logic = logic;
    this.projectList = document.getElementById('project-list');
    this.todoList = document.getElementById('todo-list');
    this.currentProjectTitle = document.getElementById('current-project-title');
    this.projectTitleInput = document.getElementById('new-project-title');
    this.addProjectBtn = document.getElementById('add-project-btn');
    this.newProjectBtn = document.getElementById('new-project-btn');
    this.addProjectForm = document.getElementById('add-project-form');
    this.cancelProjectBtn = document.getElementById('cancel-project-btn');
    this.newTodoBtn = document.getElementById('new-todo-btn');
    this.todoModal = document.getElementById('todo-modal');
    this.todoForm = document.getElementById('add-todo-form');
    this.closeDialogBtn = document.getElementById('close-dialog');
    this.detailsModal = document.getElementById('todo-details-modal');
    this.closeDetailsModalBtn = document.getElementById('close-details-btn');
    this.detailsTitle = document.getElementById('details-title');
    this.detailsDescription = document.getElementById('details-description');
    this.detailsDueDate = document.getElementById('details-dueDate');
    this.detailsPriority = document.getElementById('details-priority');
    this.detailsNotes = document.getElementById('details-notes');
    this.editTodoBtn = document.getElementById('edit-todo-btn');
    this.deleteTodoBtn = document.getElementById('delete-todo-btn');

    this.activeTodo = null;
  }

  init() {
    this.renderProjects();
    this.renderTodos();
    this.initEventListeners();
  }

  renderProjects() {
    this.projectList.innerHTML = '';
    this.logic.getProjects().forEach((project, index) => {
      const li = document.createElement('li');
      li.classList.add('project-item');
      if (index === this.logic.currentProjectIndex) {
        li.classList.add('active');
      }

      const label = document.createElement('span');
      label.textContent = project.name;
      label.addEventListener('click', () => {
        this.logic.setCurrentProject(index);
        this.renderProjects();
        this.renderTodos();
      });

      li.appendChild(label);

      if (project.name !== 'Default') {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.classList.add('delete-project-btn');
        deleteBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          this.logic.deleteProject(project.id);
          this.renderProjects();
          this.renderTodos();
        });
        li.appendChild(deleteBtn);
      }

      this.projectList.appendChild(li);
    });
  }

  renderTodos() {
    const project = this.logic.getCurrentProject();
    this.currentProjectTitle.textContent = project.name;
    this.todoList.innerHTML = '';

    project.getTodos().forEach((todo) => {
      const li = document.createElement('li');
      li.classList.add('todo-item', `priority-${todo.priority.toLowerCase()}`);

      if (todo.checklist) {
        li.classList.add('completed');
      }

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.checklist;
      checkbox.addEventListener('change', () => {
        this.logic.toggleTodoComplete(todo.id);
        this.renderTodos();
      });

      const info = document.createElement('div');
      info.classList.add('todo-info');

      const title = document.createElement('span');
      title.classList.add('todo-title');
      title.textContent = todo.title;

      const date = document.createElement('span');
      date.classList.add('todo-date');
      date.textContent = format(new Date(todo.dueDate), 'MMM do, yyyy');

      info.appendChild(title);
      info.appendChild(date);
      li.appendChild(checkbox);
      li.appendChild(info);

      li.addEventListener('click', (event) => {
        if (event.target.tagName !== 'INPUT') {
          this.showTodoDetails(todo);
        }
      });

      this.todoList.appendChild(li);
    });
  }

  initEventListeners() {
    this.newProjectBtn.addEventListener('click', () => {
      this.addProjectForm.classList.toggle('hidden');
    });

    this.cancelProjectBtn.addEventListener('click', () => {
      this.addProjectForm.classList.add('hidden');
      this.projectTitleInput.value = '';
    });

    this.addProjectBtn.addEventListener('click', () => {
      const name = this.projectTitleInput.value.trim();
      if (name) {
        this.logic.addProject(name);
        this.projectTitleInput.value = '';
        this.addProjectForm.classList.add('hidden');
        this.renderProjects();
      }
    });

    this.newTodoBtn.addEventListener('click', () => {
      this.activeTodo = null;
      this.todoForm.reset();
      this.todoModal.showModal();
    });

    this.closeDialogBtn.addEventListener('click', () => {
      this.todoModal.close();
    });

    this.todoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(this.todoForm);
      const todoData = {
        title: formData.get('todo-title')?.trim(),
        description: formData.get('todo-description')?.trim() || '',
        dueDate: formData.get('todo-date') || '',
        priority: formData.get('todo-priority') || 'Medium',
        notes: formData.get('todo-notes')?.trim() || '',
      };

      if (!todoData.title || !todoData.dueDate) {
        return;
      }

      if (this.activeTodo) {
        this.logic.updateTodo(this.activeTodo.id, todoData);
      } else {
        this.logic.addTodo(todoData);
      }

      this.todoForm.reset();
      this.todoModal.close();
      this.renderTodos();
    });

    this.closeDetailsModalBtn.addEventListener('click', () => {
      this.detailsModal.classList.add('hidden');
    });

    this.editTodoBtn.addEventListener('click', () => {
      if (!this.activeTodo) {
        return;
      }

      this.detailsModal.classList.add('hidden');
      this.todoForm.elements['todo-title'].value = this.activeTodo.title;
      this.todoForm.elements['todo-description'].value = this.activeTodo.description;
      this.todoForm.elements['todo-date'].value = this.activeTodo.dueDate;
      this.todoForm.elements['todo-priority'].value = this.activeTodo.priority;
      this.todoForm.elements['todo-notes'].value = this.activeTodo.notes;
      this.todoModal.showModal();
    });

    this.deleteTodoBtn.addEventListener('click', () => {
      if (!this.activeTodo) {
        return;
      }

      this.logic.deleteTodo(this.activeTodo.id);
      this.detailsModal.classList.add('hidden');
      this.renderTodos();
    });
  }

  showTodoDetails(todo) {
    this.activeTodo = todo;
    this.detailsTitle.textContent = todo.title;
    this.detailsDescription.textContent = todo.description || 'No description';
    this.detailsDueDate.textContent = format(new Date(todo.dueDate), 'MMM do, yyyy');
    this.detailsPriority.textContent = todo.priority;
    this.detailsNotes.textContent = todo.notes || 'No notes';
    this.detailsModal.classList.remove('hidden');
  }
}