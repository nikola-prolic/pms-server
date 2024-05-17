"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTasks = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.createTask = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Create a Task
async function createTask(req, res) {
    const { name, estimatedHours, status, deadline, projectId, assignedUserId, } = req.body;
    try {
        const newTask = await prisma_1.default.task.create({
            data: {
                name,
                estimatedHours,
                actualHours: 0,
                status,
                deadline,
                projectId,
                assignedUserId,
            },
        });
        res.status(201).json({ message: "Task created", task: newTask });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create task" });
    }
}
exports.createTask = createTask;
// Get a Task by ID
async function getTaskById(req, res) {
    const id = req.params.id;
    try {
        const task = await prisma_1.default.task.findUnique({
            where: { id },
            include: {
                project: true, // Include project details
                assignedUser: true, // Include details about the user assigned to this task
            },
        });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(task);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving task" });
    }
}
exports.getTaskById = getTaskById;
// Update a Task
async function updateTask(req, res) {
    const id = req.params.id;
    const { name, estimatedHours, actualHours, status, deadline, startedAt, completedAt, assignedUserId, } = req.body;
    try {
        const updatedTask = await prisma_1.default.task.update({
            where: { id },
            data: {
                name,
                estimatedHours,
                actualHours,
                status,
                deadline,
                startedAt,
                completedAt,
                assignedUserId,
            },
        });
        res.json({ message: "Task updated", task: updatedTask });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update task" });
    }
}
exports.updateTask = updateTask;
// Delete a Task
async function deleteTask(req, res) {
    const id = req.params.id;
    try {
        await prisma_1.default.task.delete({
            where: { id },
        });
        res.status(200).json({ message: "Task deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete task" });
    }
}
exports.deleteTask = deleteTask;
// List all Tasks for a Project
async function listTasks(req, res) {
    const projectId = req.query.projectId;
    try {
        const tasks = await prisma_1.default.task.findMany({
            where: {
                projectId: projectId, // Ensure projectId is provided as string
            },
            include: {
                project: true, // Optionally include project details
                assignedUser: true, // Optionally include the assigned user
            },
        });
        res.status(200).json({ tasks });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching tasks" });
    }
}
exports.listTasks = listTasks;
