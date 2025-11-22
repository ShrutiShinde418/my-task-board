import express from "express";
import { login, signup, removeUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/remove/user", removeUser);

export default router;
