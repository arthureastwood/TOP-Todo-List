import './styles.css';
import { DisplayController } from './displayController.js';
import { TodoApp } from './appLogic.js';

const appLogic = new TodoApp();
const displayController = new DisplayController(appLogic);
displayController.init();