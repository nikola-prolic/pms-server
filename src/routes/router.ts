import express from "express";
import userRouter from "./user";
import organizationRouter from "./organization";
import inviteRouter from "./invite";
import projectRouter from "./project";
import taskRouter from "./task";

const router = express.Router();

router.use("/user", userRouter);
router.use("/organization", organizationRouter);
router.use("/invite", inviteRouter);
router.use("/project", projectRouter);
router.use("/task", taskRouter);

export default router;
