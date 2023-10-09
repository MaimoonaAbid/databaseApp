import React from 'react';

import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './Components/LandingPage/LandingPage';
import AdminPage from './Components/AdminPage/AdminPage';
import UserPage from './Components/UserPage/UserPage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/UserPage" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
