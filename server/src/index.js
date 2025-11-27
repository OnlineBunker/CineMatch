import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// getting all the routes 
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import tmdbRoutes from "./routes/tmdbRoutes.js";

const app = express();
dotenv.config();

// have to understand
app.use(
  cors({
    origin: "https://cine-match-xi.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/tmdb", tmdbRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});