import prisma from "../config/db.js";

const addToWatchlist = async (req, res) => {
  try {
    const tmdbId = Number(req.params.tmdbId);

    const existingEntry = await prisma.watchlist.findFirst({
      where: {
        tmdbId,
        userId: req.user.id,
      },
    });

    if (existingEntry) {
      return res.status(400).json({ message: "Already in watchlist" });
    }

    const item = await prisma.watchlist.create({
      data: {
        tmdbId,
        userId: req.user.id,
      },
    });
    res.status(201).json({ message: "Added to watchlist", item });
    
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyWatchlist = async (req, res) => {
  try {
    const items = await prisma.watchlist.findMany({
      where: { userId: req.user.id },
    });
    res.status(200).json({ items });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const tmdbId = Number(req.params.tmdbId);

    const item = await prisma.watchlist.findFirst({
      where: {
        tmdbId,
        userId: req.user.id,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Not found in watchlist" });
    }

    await prisma.watchlist.delete({
      where: { id: item.id },
    });
    res.status(200).json({ message: "Removed from watchlist" });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addToWatchlist, getMyWatchlist, removeFromWatchlist };
