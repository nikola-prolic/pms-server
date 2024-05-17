"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invite_controller_1 = require("../controllers/invite.controller");
const inviteRouter = express_1.default.Router();
inviteRouter.post("/", invite_controller_1.createInvite);
inviteRouter.post("/accept/:id", invite_controller_1.acceptInvite);
inviteRouter.get("/", invite_controller_1.listInvites);
inviteRouter.get("/:id", invite_controller_1.getInviteById);
inviteRouter.get("/email/:email", invite_controller_1.getInviteByEmail);
inviteRouter.get("/email/:orgId", invite_controller_1.getInviteByOrgId);
inviteRouter.delete("/:id", invite_controller_1.deleteInvite);
exports.default = inviteRouter;
