import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header'; 
import Home from './components/Home'; // Import Home component
import LoginPage from './pages/login'; 
import Dashboard from './components/dashboard'; 
import TopArtists from './components/topArtists'; 
import ArtistCard from './components/artistCard';


export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top-artists" element={<h1>Top Artists</h1>} />
       {/* <Route path="/top-artists" element={<topArtists />} /> */}
        <Route path="/top-tracks" element={<h1>Top Tracks </h1>} />
        <Route path="/top-genres" element={<h1>Top Genres </h1>} />
        <Route path="/recently-played" element={<h1>Recently Played </h1>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

