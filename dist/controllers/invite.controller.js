"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvite = exports.listInvites = exports.getInviteByEmail = exports.getInviteByOrgId = exports.getInviteById = exports.acceptInvite = exports.createInvite = void 0;
const prisma_1 = __importDefault(require("../prisma"));
async function createInvite(req, res) {
    const { userEmail, organizationId } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: {
                email: userEmail
            }
        });
        const newInvite = await prisma_1.default.invite.create({
            data: {
                userEmail,
                organizationId,
                userId: user.id,
            },
        });
        res.status(201).json({ message: "Invite created", invite: newInvite });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create invite" });
    }
}
exports.createInvite = createInvite;
async function acceptInvite(req, res) {
    const id = req.params.id;
    try {
        const invite = await prisma_1.default.invite.findUnique({
            where: { id },
        });
        if (!invite) {
            return res.status(404).json({ error: "Invite not found" });
        }
        await prisma_1.default.user.update({
            where: {
                id: invite.userId,
            },
            data: {
                organizationId: invite.organizationId
            }
        });
        await prisma_1.default.invite.delete({
            where: {
                id: id
            }
        });
        res.status(200).json({ invite: invite });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving invite" });
    }
}
exports.acceptInvite = acceptInvite;
async function getInviteById(req, res) {
    const id = req.params.id;
    try {
        const invite = await prisma_1.default.invite.findUnique({
            where: { id },
        });
        if (!invite) {
            return res.status(404).json({ error: "Invite not found" });
        }
        res.status(200).json(invite);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving invite" });
    }
}
exports.getInviteById = getInviteById;
async function getInviteByOrgId(req, res) {
    const orgId = req.params.orgId;
    try {
        const invite = await prisma_1.default.invite.findUnique({
            where: { organizationId: orgId },
            include: {
                organization: true,
                user: true,
            },
        });
        if (!invite) {
            return res.status(404).json({ error: "No invite found for this email" });
        }
        res.status(200).json(invite);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving invite by email" });
    }
}
exports.getInviteByOrgId = getInviteByOrgId;
async function getInviteByEmail(req, res) {
    const userEmail = req.params.email;
    try {
        const invite = await prisma_1.default.invite.findUnique({
            where: { userEmail },
            include: {
                organization: true,
                user: true,
            },
        });
        if (!invite) {
            return res.status(404).json({ error: "No invite found for this email" });
        }
        res.status(200).json(invite);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving invite by email" });
    }
}
exports.getInviteByEmail = getInviteByEmail;
async function listInvites(_req, res) {
    try {
        const invites = await prisma_1.default.invite.findMany({});
        res.status(200).json({ invites });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching invites" });
    }
}
exports.listInvites = listInvites;
async function deleteInvite(req, res) {
    const id = req.params.id;
    try {
        await prisma_1.default.invite.delete({
            where: { id },
        });
        res.status(200).json({ message: "Invite deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete invite" });
    }
}
exports.deleteInvite = deleteInvite;
