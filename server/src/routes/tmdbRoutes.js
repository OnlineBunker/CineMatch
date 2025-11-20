import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const TMDB_BASE = "https://api.themoviedb.org/3";
const KEY = process.env.TMDB_API_KEY;

// Trending
router.get("/trending", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/trending/movie/day`, {
      params: { api_key: KEY }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Trending fetch failed" });
  }
});

// Top Rated
router.get("/top-rated", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/top_rated`, {
      params: { api_key: KEY }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Top rated fetch failed" });
  }
});

// New Releases
router.get("/new-releases", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/now_playing`, {
      params: { api_key: KEY, language: "en-US", page: 1 }
    });
    res.json(data);
  } catch {
    res.status(500).json({ message: "New releases failed" });
  }
});

// Genres
router.get("/genre/:genreId", async (req, res) => {
  try {
    const { genreId } = req.params;

    const url = `${TMDB_BASE}/discover/movie?api_key=${KEY}&with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=500`;

    const { data } = await axios.get(url);

    res.json(data);
  } catch (err) {
    console.error("GENRE ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "Genre fetch failed" });
  }
});



export default router;
