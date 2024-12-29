import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import NumberedList from '../assets/NumberedList.png';
import Playlist from '../assets/Playlist.png';
import RecentlyPlayed from '../assets/RecentlyPlayed.png';

export default function Home() {
    return (
      <div className="home-container">
        <h1>Welcome to Soundscape of Spotify</h1>
        <p>Explore your top tracks, artists, genres, and more!</p>
        <div className="button-container">
          <Link to="/top-tracks" className="btn btn-primary">
            View Top Tracks
          </Link>
          <Link to="/top-artists" className="btn btn-success">
            View Top Artists
          </Link>
          <Link to="/top-genres" className="btn btn-warning">
            View Top Genres
          </Link>
          <Link to="/recently-played" className="btn btn-info">
            View Recently Played
          </Link>
        </div>

        <div className="charts-container">
            <img
                src={NumberedList}
                alt="Numbered List Logo"
                className="charts-logo"            

            />
            <div className="text-content">
                 <h4>Personalized Metrics</h4>
                 <p>Explore your top artists, genres, and tracks across <br />
                    three distinct timeframes, with data refreshed daily. 
                 </p>
                </div>
        </div>
        
        <div className="playlist-container">
            <img
                src={Playlist}
                alt="Playlist Logo"
                className="playlist-logo"
            />  
            <div className="text-content">
                 <h4>Create Playlists</h4>
                 <p>Generate a playlist from your personalized metrics <br />
                    and enjoy it directly in the Spotify app. 
                 </p>
                </div>
        </div>
        <div className="recentlyPlayed-container">
            <img
                src={RecentlyPlayed}
                alt="Recently Played Logo"
                className="recentlyPlayed-logo"
            />
            <div className="text-content">
                 <h4>Recently Played Tracks</h4>
                 <p> View tracks you've recently played with their <br />
                    timestamps.
                 </p>
                </div>
        </div>
      </div>
            
    );
  }
