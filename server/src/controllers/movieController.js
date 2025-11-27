// searching and fetching details of movies

import axios from "axios";

// tmdb base url for all the api calling stuff
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// saved api key in the .env file 
const API_KEY = process.env.TMDB_API_KEY;

const searchMovies = async (req, res) => {
  try {
    // query.query means that in the res.query there is a json result which has another query as its parameter
    // here query is the input in words that are going to be searched 
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    // response is the array of all the movies that are result of the search that user made
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
      },
    });

    // return all those movies
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "TMDB search failed" });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const tmdbId = req.params.tmdbId;

    // we are fetching videos, images and credits on the movie id 
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
