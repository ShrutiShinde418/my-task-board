import express from "express";

const router = express.Router();

router.get("/boards/:board-id");

router.post("/boards");

router.put("/boards/:board-id");

router.delete("/boards/:board-id");


export default router;