"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjects = exports.deleteProject = exports.updateProject = exports.getProjectById = exports.createProject = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const client_1 = require("@prisma/client");
// Create a Project
async function createProject(req, res) {
    const { name, organizationId, deadline, projectOwnerId, startedAt, } = req.body;
    try {
        const newProject = await prisma_1.default.project.create({
            data: {
                name,
                estimatedHours: 0,
                actualHours: 0,
                status: client_1.Status.CREATED,
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create project" });
    }
}
exports.createProject = createProject;
// Get a Project by ID
async function getProjectById(req, res) {
    const id = req.params.id;
    try {
        const project = await prisma_1.default.project.findUnique({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving project" });
    }
}
exports.getProjectById = getProjectById;
// Update a Project
async function updateProject(req, res) {
    const id = req.params.id;
    const { name, status, deadline, startedAt, completedAt, } = req.body;
    try {
        const updatedProject = await prisma_1.default.project.update({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update project" });
    }
}
exports.updateProject = updateProject;
// Delete a Project
async function deleteProject(req, res) {
    const id = req.params.id;
    try {
        await prisma_1.default.project.delete({
            where: { id },
        });
        res.status(200).json({ message: "Project deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete project" });
    }
}
exports.deleteProject = deleteProject;
// List all Projects
async function listProjects(req, res) {
    try {
        const projects = await prisma_1.default.project.findMany({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching projects" });
    }
}
exports.listProjects = listProjects;
