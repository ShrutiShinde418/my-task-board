import express from "express";
import {
  createTaskController,
  updateTaskController,
} from "../controllers/tasksController.js";

const router = express.Router();

router.post("/tasks/create", createTaskController);

router.put("/tasks/:task-id", updateTaskController);

router.delete("/tasks/:task-id");

export default router;
