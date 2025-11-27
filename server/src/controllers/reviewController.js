// creating, fetching, updating, deleting *reviews*

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

// only { comment } is being added in the review section 
const createReview = async (req, res) => {
  try {
    const { tmdbId, rating, comment } = req.body;

    if (!tmdbId || !rating || !comment) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // adding the review to database
    const review = await prisma.review.create({
      data: {
        tmdbId: Number(tmdbId),
        rating: Number(rating),
        comment,
        // this is how we get the user_id 
        userId: req.user.id,
      },
    });

    res.status(201).json({ message: "Review created successfully", review });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyReviews = async (req, res) => {
  try {
    // trying to fetch all the reviews
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
    });

    // this is to return the { title, poster_image } also of the review 
    const enriched = await Promise.all(
      reviews.map(async (review) => {
        try {
          const tmdb = await fetchWithRetry(`${TMDB_BASE}${review.tmdbId}`);

          // that is why we are returning these
          return {
            ...review,
            title: tmdb.data.title,
            poster_path: tmdb.data.poster_path,
          };
        } catch {
          return {
            ...review,
            title: "Unavailable",
            poster_path: null,
          };
        }
      })
    );

    res.status(200).json({ reviews: enriched });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// normal deletion of any review based on its reviewId
const deleteReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.userId !== req.user.id) {
      return res.status(404).json({ message: "Not allowed" });
    }

    await prisma.review.delete({ where: { id: reviewId } });

    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);
    const { rating, comment } = req.body;

    // checking wether the review exists in the first place
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.userId !== req.user.id) {
      return res.status(404).json({ message: "Not allowed" });
    }

    // simple updation
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { rating: Number(rating), comment },
    });

    res.status(200).json({ message: "Review updated successfully", updatedReview });

  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createReview, getMyReviews, deleteReview, updateReview };
