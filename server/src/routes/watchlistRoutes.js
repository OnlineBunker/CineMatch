const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    addToWatchlist,
    getMyWatchlist,
    removeFromWatchlist
} = require("../controllers/watchlistController");

router.post("/:tmdbId", authMiddleware, addToWatchlist);
router.get("/", authMiddleware, getMyWatchlist);
router.delete("/:tmdbId", authMiddleware, removeFromWatchlist);

module.exports = router;