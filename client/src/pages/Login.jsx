import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import "../styles/AuthForm.css";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [trendingImages, setTrendingImages] = useState([]);
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % trendingImages.length);
  const prev = () =>
    setIndex((i) => (i - 1 + trendingImages.length) % trendingImages.length);

  // Fetch trending backgrounds from your backend
  useEffect(() => {
    const load = async () => {
      const data = await fetch("https://cinematch-8xa3.onrender.com/api/tmdb/trending").then((r) => r.json());
      setTrendingImages(
        data.results
          .filter((m) => m.backdrop_path)
          .map((m) => `https://image.tmdb.org/t/p/original${m.backdrop_path}`)
      );
    };
    load();
  }, []);

  // Auto rotate every 8 seconds
  useEffect(() => {
    if (!trendingImages.length) return;
    const id = setInterval(next, 8000);
    return () => clearInterval(id);
  }, [trendingImages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginUser(email, password);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="auth-bg"
      style={{
        backgroundImage: trendingImages.length
          ? `url(${trendingImages[index]})`
          : "none",
      }}
    >
      <div className="auth-blur-overlay" />

      <form onSubmit={handleSubmit} className="auth-form glass-form">
        <h2>Login</h2>
        {error && <p className="error-msg">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>

      {/* Right-bottom arrows */}
      {trendingImages.length > 0 && (
        <div className="auth-arrows">
          <button onClick={prev}>‹</button>
          <button onClick={next}>›</button>
        </div>
      )}
    </div>
  );
};

export default Login;
