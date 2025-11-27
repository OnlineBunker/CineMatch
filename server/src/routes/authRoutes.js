import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// the routes will be taken to the respective backend logic
router.post("/signup", signup);
router.post("/login", login);

export default router;