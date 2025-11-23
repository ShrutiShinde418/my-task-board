import express from "express";
import {
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/tasksController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/tasks/create", authMiddleware, createTaskController);

router.put("/tasks/:taskId", authMiddleware, updateTaskController);

router.delete("/tasks/:taskId", authMiddleware, deleteTaskController);

export default router;
