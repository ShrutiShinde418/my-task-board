import express from "express";
import {
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/tasksController.js";

const router = express.Router();

router.post("/tasks/create", createTaskController);

router.put("/tasks/:taskId", updateTaskController);

router.delete("/tasks/:taskId", deleteTaskController);

export default router;
