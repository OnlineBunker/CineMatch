const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});