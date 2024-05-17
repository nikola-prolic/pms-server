import express from "express";
import {
  acceptInvite,
  createInvite,
  deleteInvite,
  getInviteByEmail,
  getInviteById,
  getInviteByOrgId,
  listInvites,
} from "../controllers/invite.controller";

const inviteRouter = express.Router();

inviteRouter.post("/", createInvite);
inviteRouter.post("/accept/:id", acceptInvite);
inviteRouter.get("/", listInvites);
inviteRouter.get("/:id", getInviteById);
inviteRouter.get("/email/:email", getInviteByEmail);
inviteRouter.get("/email/:orgId", getInviteByOrgId);
inviteRouter.delete("/:id", deleteInvite);

export default inviteRouter;
