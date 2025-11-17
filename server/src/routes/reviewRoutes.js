const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    createReview,
    getMyReviews,
    deleteReview,
    updateReview
} = require("../controllers/reviewController");

router.post("/", authMiddleware, createReview);
router.get("/my-reviews", authMiddleware, getMyReviews);
router.delete("/:id", authMiddleware, deleteReview);
router.put("/:id", authMiddleware, updateReview);

module.exports = router;