import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/MoviePage.css";

const MoviePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [watchlistStatus, setWatchlistStatus] = useState(false);
  const [reviewStatus, setReviewStatus] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [submittedReview, setSubmittedReview] = useState(null);
  const reviewRef = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`https://cinematch-8xa3.onrender.com/api/movies/${id}`);
      const data = await res.json();
      setMovie(data);
    };

    const fetchWatchlist = async () => {
      if (!user) return;
      const res = await fetch("https://cinematch-8xa3.onrender.com/api/watchlist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setWatchlistStatus(data.items.some((item) => item.tmdbId === Number(id)));
    };

    const fetchReview = async () => {
      if (!user) return;
      const res = await fetch("https://cinematch-8xa3.onrender.com/api/reviews/my-reviews", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      const review = data.reviews.find((r) => r.tmdbId === Number(id));
      if (review) {
        setReviewStatus(true);
        setReviewText(review.comment);
        setSubmittedReview(review);
      }
    };

    fetchDetails();
    fetchWatchlist();
    fetchReview();
  }, [id, user]);

  const toggleWatchlist = async () => {
    if (!user) return alert("Please login to modify watchlist");
    const method = watchlistStatus ? "DELETE" : "POST";
    const endpoint = `https://cinematch-8xa3.onrender.com/api/watchlist/${id}`;
    await fetch(endpoint, {
      method,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setWatchlistStatus(!watchlistStatus);
  };

  const scrollToReview = () => {
    if (!user) return alert("Please login to write a review");
    reviewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const submitReview = async () => {
    const res = await fetch("https://cinematch-8xa3.onrender.com/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        tmdbId: Number(id),
        rating: 9,
        comment: reviewText,
      }),
    });
    const data = await res.json();
    setReviewStatus(true);
    setSubmittedReview(data.review);
  };

  const deleteReview = async () => {
    if (!submittedReview) return;
    await fetch(`https://cinematch-8xa3.onrender.com/api/reviews/${submittedReview.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setReviewText("");
    setReviewStatus(false);
    setSubmittedReview(null);
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div
      className="movie-detail"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="overlay">
        <div className="title-actions-wrapper">
          <div className="title-bar">
            <h1>{movie.title}</h1>
          </div>
          <div className="spacer"></div>
          <div className="action-buttons">
            <button
              onClick={toggleWatchlist}
              className={watchlistStatus ? "active" : ""}
            >
              {user
                ? watchlistStatus
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"
                : "Add to Watchlist"}
            </button>
            <button
              onClick={reviewStatus ? deleteReview : scrollToReview}
              className={reviewStatus ? "active" : ""}
            >
              {user
                ? reviewStatus
                  ? "Delete Review"
                  : "Write a Review"
                : "Write a Review"}
            </button>
          </div>
        </div>

        <div className="details-panel">
          <p>
            <strong>Description:</strong> {movie.overview}
          </p>
          <p>
            <strong>Release Year:</strong> {movie.release_date?.slice(0, 4)}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres?.map((g) => g.name).join(", ")}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}
          </p>
        </div>

        {user && reviewStatus && submittedReview && (
          <div className="review-box">
            <h3>Your Review</h3>
            <p>{submittedReview.comment}</p>
          </div>
        )}

        {user && !reviewStatus && (
          <div ref={reviewRef} className="review-box">
            <textarea
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
            <button onClick={submitReview}>Publish Review</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
