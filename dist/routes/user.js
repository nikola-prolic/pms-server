"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
userRouter.get("/", user_controller_1.queryUsers);
userRouter.get("/:id", user_controller_1.getUserById);
userRouter.get("/email/:email", user_controller_1.getUserByEmail);
userRouter.post("/", user_controller_1.createUser);
userRouter.put("/:id", user_controller_1.updateUser);
userRouter.delete("/:id", user_controller_1.deleteUser);
exports.default = userRouter;
