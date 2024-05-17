import { Request, Response } from "express";
import prisma from "../prisma";
import { Status } from "@prisma/client";

// Create a Project
export async function createProject(req: Request, res: Response) {
  const {
    name,
    organizationId,
    deadline,
    projectOwnerId,
    startedAt,
  } = req.body;
  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        estimatedHours: 0,
        actualHours: 0,
        status: Status.CREATED,
        organizationId,
        deadline,
        projectOwnerId,
        startedAt,
      },
      include: {
        projectOwner: true,
        tasks: {
          include: {
            assignedUser: true
          }
        }
      }
    });
    res.status(201).json({ message: "Project created", project: newProject });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
}

// Get a Project by ID
export async function getProjectById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignedUser: true
          }
        }, // Include tasks related to the project
        projectOwner: true, // Include details about the project owner
      },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project found", project: project });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving project" });
  }
}

// Update a Project
export async function updateProject(req: Request, res: Response) {
  const id = req.params.id;
  const {
    name,
    status,
    deadline,
    startedAt,
    completedAt,
  } = req.body;
  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name,
        estimatedHours: 0,
        status,
        deadline,
        startedAt,
        completedAt,
      },
      include: {
        projectOwner: true,
        tasks: {
          include: {
            assignedUser: true
          }
        }
      }
    });
    res.json({ message: "Project updated", project: updatedProject });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to update project" });
  }
}

// Delete a Project
export async function deleteProject(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await prisma.project.delete({
      where: { id },
    });
    res.status(200).json({ message: "Project deleted" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete project" });
  }
}

// List all Projects
export async function listProjects(req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: {
          include: {
            assignedUser: true
          }
        },
        projectOwner: true, // Optionally include project owner
      },
    });
    res.status(200).json({ projects });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error fetching projects" });
  }
}
