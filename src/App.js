import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header'; 
import Home from './components/Home'; // Import Home component
import LoginPage from './pages/login'; 
import Dashboard from './components/dashboard'; 
import TopArtists from './components/TopArtists'; 
import TopTracks from './components/TopTracks';
import RecentlyPlayed from './components/RecentlyPlayed'; 
import TopGenres from './components/TopGenres'; 
import ArtistCard from './components/artistCard';


export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Top-artists" element={<TopArtists />} />
        <Route path="/Top-tracks" element={<TopTracks/>} />
        <Route path="/top-genres" element={<TopGenres/>} />
        <Route path="/recently-played" element={<RecentlyPlayed />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

