import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createReview,
  getMyReviews,
  deleteReview,
  updateReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/my-reviews", authMiddleware, getMyReviews);
router.delete("/:id", authMiddleware, deleteReview);
router.put("/:id", authMiddleware, updateReview);

export default router;
