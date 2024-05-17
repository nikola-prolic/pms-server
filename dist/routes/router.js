"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const organization_1 = __importDefault(require("./organization"));
const invite_1 = __importDefault(require("./invite"));
const project_1 = __importDefault(require("./project"));
const task_1 = __importDefault(require("./task"));
const router = express_1.default.Router();
router.use("/user", user_1.default);
router.use("/organization", organization_1.default);
router.use("/invite", invite_1.default);
router.use("/project", project_1.default);
router.use("/task", task_1.default);
exports.default = router;
