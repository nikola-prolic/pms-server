"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrganizations = exports.deleteOrganization = exports.updateOrganization = exports.getOrganizationById = exports.createOrganization = void 0;
const prisma_1 = __importDefault(require("../prisma"));
async function createOrganization(req, res) {
    const { name, adminId } = req.body;
    try {
        const newOrganization = await prisma_1.default.organization.create({
            data: {
                name,
                adminId,
            },
        });
        await prisma_1.default.user.update({
            where: {
                id: adminId,
            },
            data: {
                organizationId: newOrganization.id
            }
        });
        res
            .status(201)
            .json({ message: "Organization created", organization: newOrganization });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create organization" });
    }
}
exports.createOrganization = createOrganization;
async function getOrganizationById(req, res) {
    const id = req.params.id;
    try {
        const organization = await prisma_1.default.organization.findUnique({
            where: { id },
            include: { users: true, projects: true },
        });
        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }
        res.status(200).json({ organization: organization });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving organization" });
    }
}
exports.getOrganizationById = getOrganizationById;
async function updateOrganization(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    try {
        const updatedOrganization = await prisma_1.default.organization.update({
            where: { id },
            data: { name },
        });
        res.json({
            message: "Organization updated",
            organization: updatedOrganization,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update organization" });
    }
}
exports.updateOrganization = updateOrganization;
async function deleteOrganization(req, res) {
    const id = req.params.id;
    try {
        await prisma_1.default.organization.delete({
            where: { id },
        });
        res.status(200).json({ message: "Organization deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete organization" });
    }
}
exports.deleteOrganization = deleteOrganization;
async function listOrganizations(_req, res) {
    try {
        const organizations = await prisma_1.default.organization.findMany({
            include: { users: true, projects: true },
        });
        res.status(200).json({ organizations });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching organizations" });
    }
}
exports.listOrganizations = listOrganizations;
