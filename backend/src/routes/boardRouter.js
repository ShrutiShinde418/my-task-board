import express from "express";
import {
  createBoardController,
  getBoardController,
  updateBoardController,
  deleteBoardController,
} from "../controllers/boardController.js";

const router = express.Router();

router.get("/boards/:boardId", getBoardController);

router.post("/boards", createBoardController);

router.put("/boards/:boardId", updateBoardController);

router.delete("/boards/:boardId", deleteBoardController);

export default router;
