import express from "express";
// middleware is required to check wether the user is logged in and then it will be able to add reviews to the users database
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addToWatchlist,
  getMyWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlistController.js";

const router = express.Router();

router.post("/:tmdbId", authMiddleware, addToWatchlist);
router.get("/", authMiddleware, getMyWatchlist);
router.delete("/:tmdbId", authMiddleware, removeFromWatchlist);

export default router;
