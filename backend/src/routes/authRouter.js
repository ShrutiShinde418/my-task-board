import express from "express";
import {
  login,
  signup,
  removeUser,
  getUserDetails,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";
import startTransaction from "../middlewares/startTransaction.js";

const router = express.Router();

router.post("/login", startTransaction, login);

router.post("/signup", startTransaction, signup);

router.get(
  "/get/user/details",
  startTransaction,
  authMiddleware,
  getUserDetails,
);

router.post("/remove/user/:userId", startTransaction, removeUser);

export default router;
