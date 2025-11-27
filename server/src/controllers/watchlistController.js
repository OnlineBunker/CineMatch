import prisma from "../config/db.js";
import axios from "axios";

const API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3/movie/";

// Retry helper
// fetching images of movies 5 times so that if failed once then it doesn't stop at one
async function fetchWithRetry(url, tries = 5, delay = 200) {
  try {
    return await axios.get(url, { params: { api_key: API_KEY } });
  } catch (err) {
    if (tries <= 1) throw err;
    await new Promise((res) => setTimeout(res, delay));
    // recursion to count the tries
    return fetchWithRetry(url, tries - 1, delay * 2);
  }
}

// normal adding a movieId in watchlist database
const addToWatchlist = async (req, res) => {
  try {
    const tmdbId = Number(req.params.tmdbId);

    const existing = await prisma.watchlist.findFirst({
      where: { tmdbId, userId: req.user.id },
    });

    if (existing) {
      return res.status(400).json({ message: "Already in watchlist" });
    }

    const item = await prisma.watchlist.create({
      data: { tmdbId, userId: req.user.id },
    });

    res.status(201).json({ message: "Added to watchlist", item });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// same as fetching all the reviews in ../reviewController.js
const getMyWatchlist = async (req, res) => {
  try {
    // fetch all the movies in the watchlist database of one userId
    const items = await prisma.watchlist.findMany({
      where: { userId: req.user.id },
    });

    const enriched = await Promise.all(
      items.map(async (item) => {
        try {
          const tmdb = await fetchWithRetry(`${TMDB_BASE}${item.tmdbId}`);

          return {
            ...item,
            title: tmdb.data.title,
            poster_path: tmdb.data.poster_path,
          };
        } catch {
          return {
            ...item,
            title: "Unavailable",
            poster_path: null,
          };
        }
      })
    );

    res.status(200).json({ items: enriched });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const tmdbId = Number(req.params.tmdbId);

    const item = await prisma.watchlist.findFirst({
      where: { tmdbId, userId: req.user.id },
    });

    if (!item) {
      return res.status(404).json({ message: "Not found in watchlist" });
    }

    await prisma.watchlist.delete({ where: { id: item.id } });

    res.status(200).json({ message: "Removed from watchlist" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addToWatchlist, getMyWatchlist, removeFromWatchlist };
