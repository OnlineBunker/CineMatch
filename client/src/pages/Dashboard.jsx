import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchWatchlist = async () => {
      const res = await fetch('https://cinematch-8xa3.onrender.com/api/watchlist', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setWatchlist(data.items || []);
    };

    const fetchReviews = async () => {
      const res = await fetch('https://cinematch-8xa3.onrender.com/api/reviews/my-reviews', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setReviews(data.reviews || []);
    };

    fetchWatchlist();
    fetchReviews();
  }, [user]);

  if (!user) return <div className="dashboard">Please login to view your dashboard.</div>;

  return (
    <div className="dashboard">
      <div className="profile-sidebar">
        <div className="profile-pic" />
        <h2>{user?.name || "No username"}</h2>
<p>{user?.email || "No email"}</p>
      </div>

      <div className="dashboard-content">
        <div className="section">
          <h3>Watchlist</h3>
          <div className="card-row">
            {watchlist.map((movie) => (
              <div
                key={movie.tmdbId}
                className="movie-card"
                onClick={() => navigate(`/movie/${movie.tmdbId}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Reviews</h3>
          <div className="card-row">
            {reviews.map((movie) => (
              <div
                key={movie.tmdbId}
                className="movie-card"
                onClick={() => navigate(`/movie/${movie.tmdbId}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;