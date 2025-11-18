import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

const searchMovies = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "TMDB search failed" });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const tmdbId = req.params.tmdbId;

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos,images,credits",
      },
    });

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "TMDB details fetch failed" });
  }
};

export { searchMovies, getMovieDetails };
