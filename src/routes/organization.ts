import express from "express";
import {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  listOrganizations,
  updateOrganization,
} from "../controllers/organization.controller";

const organizationRouter = express.Router();

organizationRouter.post("/", createOrganization);
organizationRouter.get("/", listOrganizations);
organizationRouter.get("/:id", getOrganizationById);
organizationRouter.put("/:id", updateOrganization);
organizationRouter.delete("/:id", deleteOrganization);

export default organizationRouter;
