"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organization_controller_1 = require("../controllers/organization.controller");
const organizationRouter = express_1.default.Router();
organizationRouter.post("/", organization_controller_1.createOrganization);
organizationRouter.get("/", organization_controller_1.listOrganizations);
organizationRouter.get("/:id", organization_controller_1.getOrganizationById);
organizationRouter.put("/:id", organization_controller_1.updateOrganization);
organizationRouter.delete("/:id", organization_controller_1.deleteOrganization);
exports.default = organizationRouter;
