import { format, parseISO } from 'date-fns';
import { TodoApp } from './appLogic.js';

export class DisplayController {
  constructor() {
    this.projectController = new TodoApp();

    this.projectList = document.getElementById('project-list');
    this.todoList = document.getElementById('todo-list');
    this.currentProjectTitle = document.getElementById('current-project-title');
    this.projectTitleInput = document.getElementById('new-project-title');
    this.addProjectBtn = document.getElementById('add-project-btn');
    this.newProjectBtn = document.getElementById('new-project-btn');
    this.newProjectModal = document.getElementById('new-project-dialog-container');
    this.addProjectForm = document.getElementById('add-project-form');
    this.cancelProjectBtn = document.getElementById('cancel-project-btn');
    this.newTodoBtn = document.getElementById('new-todo-btn');
    this.todoModal = document.getElementById('todo-modal');
    this.todoForm = document.getElementById('add-todo-form');
    this.addTodoBtn = document.getElementById('add-todo-btn');
    this.closeTodoDialogBtn = document.getElementById('close-todo-dialog');
    this.detailsModal = document.getElementById('todo-details-modal');
    this.closeDetailsDialogBtn = document.getElementById('close-details-btn');
    this.detailsTitle = document.getElementById('details-title');
    this.detailsDescription = document.getElementById('details-description');
    this.detailsDueDate = document.getElementById('details-dueDate');
    this.detailsPriority = document.getElementById('details-priority');
    this.detailsNotes = document.getElementById('details-notes');
    this.editTodoBtn = document.getElementById('edit-todo-btn');
    this.deleteTodoBtn = document.getElementById('delete-todo-btn');
    this.todoTitleInput = document.getElementById('todo-title-input');
    this.todoDescriptionInput = document.getElementById('todo-description-input');
    this.todoDateInput = document.getElementById('todo-date-input');
    this.todoPriorityInput = document.getElementById('todo-priority-input');
    this.todoNotesInput = document.getElementById('todo-notes-input');

    this.activeTodo = null;
  }

  init() {
    this.renderProjects();
    this.renderTodos();
    this.initEventListeners();
  }

  renderProjects() {
    this.projectList.innerHTML = '';
    this.projectController.projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.classList.add('project-item');
      if (index === this.projectController.currentProjectIndex) {
        li.classList.add('active');
      }

      const label = document.createElement('span');
      label.textContent = project.name;
      li.addEventListener('click', () => {
        this.projectController.setCurrentProject(index);
        this.currentProjectTitle.textContent = project.name;
        this.renderProjects();
        this.renderTodos();
      });

      li.appendChild(label);

      if (project.name !== 'Default') {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.classList.add('delete-project-btn');
        deleteBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          this.projectController.deleteProject(project.id);
          this.renderProjects();
          this.renderTodos();
        });
        li.appendChild(deleteBtn);
      }

      this.projectList.appendChild(li);
    });
  }

  renderTodos() {
    const currentProject = this.projectController.getCurrentProject();
    this.currentProjectTitle = this.currentProjectTitle;
    if(this.currentProjectTitle){
      this.currentProjectTitle.textContent = currentProject.name;
    }
    this.todoList.innerHTML = '';

    currentProject.getTodos().forEach((todo) => {
      const li = document.createElement('li');
      li.classList.add('todo-item', `priority-${todo.priority.toLowerCase()}`);

      if (todo.checklist) {
        li.classList.add('completed');
      }

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.checklist;
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        this.projectController.toggleTodoComplete(todo.id);
        this.renderTodos();
      });

      const todoInfo = document.createElement('div');
      todoInfo.classList.add('todo-info');

      const title = document.createElement('span');
      title.classList.add('todo-title');
      title.textContent = todo.title;

      const date = document.createElement('span');
      date.classList.add('todo-date');
      date.textContent = format(parseISO(todo.dueDate), 'MMM dd, yyyy');

      todoInfo.appendChild(title);
      todoInfo.appendChild(date);

      const inlineDeleteBtn = document.createElement('button');
      inlineDeleteBtn.innerHTML = '&#128465;';
      inlineDeleteBtn.classList.add('inline-delete-todo-btn');

      inlineDeleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.projectController.deleteTodo(todo.id);
        this.renderTodos();
      });

      li.appendChild(checkbox);
      li.appendChild(todoInfo);
      li.appendChild(inlineDeleteBtn);

      li.addEventListener('click', (event) => {
        if (event.target.tagName !== 'INPUT' && !event.target.classList.contains('inline-delete-todo-btn')) {
          this.showTodoDetails(todo);
        }
      });

      this.todoList.appendChild(li);
    });
  }

  initEventListeners() {
    this.newProjectBtn.addEventListener('click', () => {
      this.newProjectModal.classList.remove("hidden");
      this.newProjectModal.showModal();
    });

    this.cancelProjectBtn.addEventListener('click', () => {
      this.projectTitleInput.value = '';
      this.newProjectModal.close();
    });

    this.addProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    this.addProjectBtn.addEventListener('click', () => {
      const name = this.projectTitleInput.value.trim();
      if (name) {
        this.projectController.addProject(name);
        this.projectTitleInput.value = '';
        this.newProjectModal.close();
        this.addProjectForm.classList.remove("hidden");

        const activeProject = this.projectController.getCurrentProject();
        if(this.currentProjectTitle && activeProject){
          this.currentProjectTitle.textContent = activeProject.name;
        }
        this.renderProjects();
        this.renderTodos();
      }
    });

    this.newTodoBtn.addEventListener('click', () => {
      this.todoModal.classList.remove("hidden");
      this.todoModal.showModal();
    });

    this.closeTodoDialogBtn.addEventListener('click', () => {
      this.todoModal.close();
    });

    this.todoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(this.todoForm);
      const todoData = {
        title: this.todoTitleInput.value?.trim(),
        description: this.todoDescriptionInput.value?.trim() || '',
        dueDate: this.todoDateInput.value || '',
        priority: this.todoPriorityInput.value || 'Medium',
        notes: this.todoNotesInput.value?.trim() || '',
      };

      if (!todoData.title || !todoData.dueDate) {
        return;
      }

      if (this.activeTodo) {
        this.projectController.updateTodo(this.activeTodo.id, todoData);
      } else {
        this.projectController.addTodo(todoData);
      }

      this.todoForm.reset();
      this.todoModal.close();
      this.todoModal.classList.add("hidden");
      this.activeTodo = null;
      this.renderTodos();
    });

    this.closeDetailsDialogBtn.addEventListener('click', () => {
      this.detailsModal.classList.add("hidden");
      this.activeTodo = null;
    });

    this.editTodoBtn.addEventListener('click', () => {
      if (!this.activeTodo) {
        return;
      }

      this.detailsModal.classList.add("hidden");
      this.todoModal.classList.remove("hidden");
      this.todoModal.showModal();
      this.todoTitleInput.value = this.activeTodo.title;
      this.todoDescriptionInput.value = this.activeTodo.description;
      this.todoDateInput.value = this.activeTodo.dueDate;
      this.todoPriorityInput.value = this.activeTodo.priority;
      this.todoNotesInput.value = this.activeTodo.notes;
      
    });

    this.deleteTodoBtn.addEventListener('click', () => {
      if (!this.activeTodo) {
        return;
      }

      this.projectController.deleteTodo(this.activeTodo.id);
      this.detailsModal.classList.add("hidden");
      this.renderTodos();
    });
  }

  showTodoDetails(todo) {
    this.activeTodo = todo;
    if(this.detailsTitle){
      this.detailsTitle.textContent = todo.title;
    }
    
    if(this.detailsDescription){
      this.detailsDescription.textContent = todo.description || 'No description';
    }

    if(this.detailsPriority){
      this.detailsPriority.textContent = todo.priority;
    }
    
    if(this.detailsNotes){
      this.detailsNotes.textContent = todo.notes || 'No notes';
    }

    if(this.detailsDueDate && todo.dueDate){
      try{
        this.detailsDueDate.textContent = format(parseISO(todo.dueDate), 'MMM dd, yyyy');
      } catch (e) {
        this.detailsDueDate.textContent = todo.dueDate;
      }
      
    }
    
    this.detailsModal.classList.remove("hidden");
  }
}