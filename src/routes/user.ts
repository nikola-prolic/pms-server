import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  queryUsers,
  updateUser,
} from "../controllers/user.controller";

import express from "express";

const userRouter = express.Router();

userRouter.get("/", queryUsers);
userRouter.get("/:id", getUserById);
userRouter.get("/email/:email", getUserByEmail);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
