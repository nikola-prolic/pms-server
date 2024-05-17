import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from "../controllers/task.controller";

const taskRouter = express.Router();

taskRouter.post("/", createTask);
taskRouter.get("/", listTasks); // List all tasks or filter by projectId
taskRouter.get("/:id", getTaskById);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
