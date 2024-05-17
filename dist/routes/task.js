"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const taskRouter = express_1.default.Router();
taskRouter.post("/", task_controller_1.createTask);
taskRouter.get("/", task_controller_1.listTasks); // List all tasks or filter by projectId
taskRouter.get("/:id", task_controller_1.getTaskById);
taskRouter.put("/:id", task_controller_1.updateTask);
taskRouter.delete("/:id", task_controller_1.deleteTask);
exports.default = taskRouter;
