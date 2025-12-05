import express from "express";
import {
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/tasksController.js";
import { authMiddleware } from "../middlewares/auth.js";
import startTransaction from "../middlewares/startTransaction.js";

const router = express.Router();

router.post(
  "/tasks/create",
  startTransaction,
  authMiddleware,
  createTaskController,
);

router.put(
  "/tasks/:taskId",
  startTransaction,
  authMiddleware,
  updateTaskController,
);

router.delete(
  "/tasks/:taskId",
  startTransaction,
  authMiddleware,
  deleteTaskController,
);

export default router;
