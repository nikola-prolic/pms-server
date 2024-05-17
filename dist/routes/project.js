"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("../controllers/project.controller");
const projectRouter = express_1.default.Router();
projectRouter.post("/", project_controller_1.createProject);
projectRouter.get("/", project_controller_1.listProjects);
projectRouter.get("/:id", project_controller_1.getProjectById);
projectRouter.put("/:id", project_controller_1.updateProject);
projectRouter.delete("/:id", project_controller_1.deleteProject);
exports.default = projectRouter;
