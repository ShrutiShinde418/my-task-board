import express from "express";
import {
  createBoardController,
  getBoardController,
  updateBoardController,
  deleteBoardController,
} from "../controllers/boardController.js";
import { authMiddleware } from "../middlewares/auth.js";
import startTransaction from "../middlewares/startTransaction.js";

const router = express.Router();

router.get(
  "/boards/:boardId",
  startTransaction,
  authMiddleware,
  getBoardController,
);

router.post("/boards", startTransaction, authMiddleware, createBoardController);

router.put(
  "/boards/:boardId",
  startTransaction,
  authMiddleware,
  updateBoardController,
);

router.delete(
  "/boards/:boardId",
  startTransaction,
  authMiddleware,
  deleteBoardController,
);

export default router;
