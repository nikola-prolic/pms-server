import { Request, Response } from "express";
import prisma from "../prisma";

// Create a Task
export async function createTask(req: Request, res: Response) {
  const {
    name,
    estimatedHours,
    status,
    deadline,
    projectId,
    assignedUserId,
  } = req.body;
  try {
    const newTask = await prisma.task.create({
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
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
}

// Get a Task by ID
export async function getTaskById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const task = await prisma.task.findUnique({
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
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving task" });
  }
}

// Update a Task
export async function updateTask(req: Request, res: Response) {
  const id = req.params.id;
  const {
    name,
    estimatedHours,
    actualHours,
    status,
    deadline,
    startedAt,
    completedAt,
    assignedUserId,
  } = req.body;
  try {
    const updatedTask = await prisma.task.update({
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
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
}

// Delete a Task
export async function deleteTask(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await prisma.task.delete({
      where: { id },
    });
    res.status(200).json({ message: "Task deleted" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
}

// List all Tasks for a Project
export async function listTasks(req: Request, res: Response) {
  const projectId = req.query.projectId;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId as string, // Ensure projectId is provided as string
      },
      include: {
        project: true, // Optionally include project details
        assignedUser: true, // Optionally include the assigned user
      },
    });
    res.status(200).json({ tasks });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error fetching tasks" });
  }
}
