// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './components/header';
// import TopArtists from './components/topArtists';
// import TopTracks from './components/topTracks';
// import TopGenres from './components/topGenres';
// import RecentlyPlayed from './components/recentlyPlayed';

// export default function App() {
//   return (
//     <Router>
//       <Header />
//       <Routes>
//         <Route path="/" element={<h1>Welcome to Soundscape of Spotify</h1>} />
//         <Route path="/top-artists" element={<TopArtists />} />
//         <Route path="/top-tracks" element={<TopTracks />} />
//         <Route path="/top-genres" element={<TopGenres />} />
//         <Route path="/recently-played" element={<RecentlyPlayed />} />
//       </Routes>
//     </Router>
//   );
// }

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header'; 
import Home from './components/Home'; // Import Home component
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
      </Routes>
    </Router>
  );
}

