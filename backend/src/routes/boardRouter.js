import express from "express";
import {
  createBoardController,
  getBoardController,
  updateBoardController,
  deleteBoardController,
} from "../controllers/boardController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/boards/:boardId", authMiddleware, getBoardController);

router.post("/boards", authMiddleware, createBoardController);

router.put("/boards/:boardId", authMiddleware, updateBoardController);

router.delete("/boards/:boardId", authMiddleware, deleteBoardController);

export default router;
