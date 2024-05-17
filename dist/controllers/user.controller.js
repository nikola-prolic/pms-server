"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.queryUsers = exports.getUserByEmail = exports.getUserById = exports.updateUser = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const client_1 = require("@prisma/client");
async function createUser(req, res) {
    const reqUser = req.body.user;
    try {
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                email: reqUser.email,
            },
        });
        if (existingUser) {
            res.status(200).json({ message: "user exists", user: existingUser });
            return;
        }
        const user = await prisma_1.default.user.create({
            data: {
                name: reqUser.name,
                email: reqUser.email,
            },
            include: {
                organization: {
                    include: {
                        users: true,
                    }
                },
                tasks: true,
                projects: true,
                invite: {
                    include: {
                        organization: true,
                    }
                }
            }
        });
        res.status(201).json({
            message: "new user created",
            user: user,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}
exports.createUser = createUser;
async function updateUser(req, res) {
    const userId = req.params.id;
    const updateData = req.body.user;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: updateData,
            include: {
                organization: true
            }
        });
        res.json({
            user: updatedUser
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                // Record not found
                return res.status(404).json({ error: "User not found" });
            }
        }
        console.error(error);
        res.status(500).json({ error: "Error updating user" });
    }
}
exports.updateUser = updateUser;
async function getUserById(req, res) {
    const id = req.params.id;
    if (!id || typeof id != "string" || id.length < 1) {
        res.status(400).json({ error: "invalid id" });
    }
    try {
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: id,
            },
            include: {
                invite: {
                    include: {
                        organization: true,
                    }
                },
                tasks: true,
                projects: true,
                organization: {
                    users: true
                }
            }
        });
        if (!user) {
            res.status(404).json({ error: "user not found" });
            return;
        }
        res.status(200).json({
            message: "user found",
            user: user,
        });
    }
    catch (err) {
        console.log("we have a problem finding user");
    }
}
exports.getUserById = getUserById;
async function getUserByEmail(req, res) {
    const email = req.params.email;
    if (!email || typeof email != "string" || email.length < 1) {
        res.status(400).json({ error: "invalid id" });
    }
    console.log(email.length);
    try {
        const user = await prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
            include: {
                organization: {
                    include: {
                        users: true,
                        invites: true
                    }
                },
                projects: true,
                tasks: true,
                invite: {
                    include: {
                        organization: true,
                    }
                }
            }
        });
        if (!user) {
            console.log("what happened user is: ", user);
            res.status(404).json({ error: "user not found" });
            return;
        }
        res.status(200).json({
            message: "user found",
            user: user,
        });
    }
    catch (err) {
        console.log("we have a problem finding user", err);
        res.status(500).json({ error: "no user found" });
    }
}
exports.getUserByEmail = getUserByEmail;
async function queryUsers(req, res) {
    const { name, email, organizationId } = req.query;
    if ((typeof name !== "string" && typeof name !== "undefined") ||
        (typeof email !== "string" && typeof email !== "undefined") ||
        (typeof organizationId !== "string" &&
            typeof organizationId !== "undefined")) {
        res.status(400).json({ error: "invalid query" });
        return;
    }
    try {
        // Build the filter object dynamically:
        const whereFilter = {
            name: name ? { contains: name, mode: "insensitive" } : undefined,
            email: email ? { contains: email, mode: "insensitive" } : undefined,
            organizationId,
        };
        Object.keys(whereFilter).forEach((key) => whereFilter[key] === undefined &&
            delete whereFilter[key]);
        const users = await prisma_1.default.user.findMany({
            where: whereFilter,
        });
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
}
exports.queryUsers = queryUsers;
async function deleteUser(req, res) {
    const id = req.params.id;
    try {
        const user = await prisma_1.default.user.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({ user });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
}
exports.deleteUser = deleteUser;
