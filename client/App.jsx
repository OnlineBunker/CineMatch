import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './src/pages/Login.jsx';
import Signup from './src/pages/Signup.jsx';

const App = () => {
return (
<Routes>
<Route path="/" element={<h1>Welcome to CineMatch</h1>} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
</Routes>
);
};

export default App;