import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject,
} from "../controllers/project.controller";

const projectRouter = express.Router();

projectRouter.post("/", createProject);
projectRouter.get("/", listProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.put("/:id", updateProject);
projectRouter.delete("/:id", deleteProject);

export default projectRouter;
