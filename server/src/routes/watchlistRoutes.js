import express from "express";
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
