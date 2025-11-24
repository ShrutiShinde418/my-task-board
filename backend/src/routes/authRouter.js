import express from "express";
import {
  login,
  signup,
  removeUser,
  getUserDetails,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.get("/get/user/details", authMiddleware, getUserDetails);

router.post("/remove/user/:userId", removeUser);

export default router;
