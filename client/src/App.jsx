import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/search.jsx";
import MovieDetails from './pages/MovieDetails.jsx';

import MainLayout from "./assets/MainLayout.jsx";
import AuthLayout from "./assets/AuthLayout.jsx";

const App = () => {
  return (
    <Routes>

      {/* Pages WITH Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Route>

      {/* Pages WITHOUT Navbar (Auth pages) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

    </Routes>
  );
};

export default App;