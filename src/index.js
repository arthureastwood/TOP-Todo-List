import { DisplayController } from "./displayController.js";
import { Todo } from "./todo.js";

const initialDisplay = new DisplayController();
initialDisplay.initDisplay();
const todo = new Todo();
todo.renderTodos();