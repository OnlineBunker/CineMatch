import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 Debounced search — triggers 400ms after typing
  useEffect(() => {
    if (!query) {
      setMovies([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchMovies(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchMovies = async (q) => {
    try {
      setLoading(true);

      const res = await fetch(`https://cinematch-8xa3.onrender.com/api/movies/search?query=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok) {
        setMovies([]);
        return;
      }

      const sorted = data.results.sort((a, b) => b.popularity - a.popularity) || [];
      setMovies(sorted);

    } catch (err) {
      console.error("Search failed:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const truncate = (text, words = 15) => {
    if (!text) return "";
    const arr = text.split(" ");
    return arr.length > words ? arr.slice(0, words).join(" ") + "..." : text;
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>{query ? "Search Results" : "Search Movies"}</h1>

        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <p className="loading">Loading...</p>}

      {!loading && query && movies.length === 0 && (
        <p className="no-results">No results found.</p>
      )}

      <div className="search-results-grid">
        {movies.map((movie) => (
          <div
            className="search-card"
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-image">No Image</div>
            )}

            <h3>{movie.title}</h3>
            <p className="meta">
              {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"} •{" "}
              {movie.vote_average.toFixed(1)}
            </p>

            <p className="overview">{truncate(movie.overview, 20)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
