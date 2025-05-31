import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './dashboard.css';

export default function Dashboard() {
  const [profile, setProfile] = useState(null); // State for user profile
  const [error, setError] = useState(null);     // State for error handling
  const location = useLocation();               // React Router location object
  const navigate = useNavigate();               // For navigation on logout

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();       // Clear stored user data
    navigate('/account');       // Redirect to login page
  };

  useEffect(() => {
    // Extract userId from the URL query parameters
    const params = new URLSearchParams(location.search);
    const userIdFromURL = params.get('userId');

    // If userId exists in URL, store it in localStorage for future use
    if (userIdFromURL) {
      localStorage.setItem('userId', userIdFromURL);
    }

    // Use userId from URL if available, otherwise fall back to localStorage
    const storedUserId = userIdFromURL || localStorage.getItem('userId');

    // If no userId is found, show an error
    if (!storedUserId) {
      setError('No user ID found. Please log in again.');
      return;
    }

    // Fetch user profile from backend using userId
    async function fetchProfile() {
      try {
        // Make API request to get Spotify profile
        const response = await fetch(`https://soundscape-backend-tc9o.onrender.com/api/me?userId=${storedUserId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        // Parse and store profile data in state
        const data = await response.json();
        setProfile(data); // Update profile state
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please try again.');
      }
    }

    // Call the fetch function once the component mounts
    fetchProfile();
  }, [location]);

  // Show error if one occurred during fetch
  if (error) {
    return <h1>{error}</h1>;
  }

  // Show loading state while fetching profile
  if (!profile) {
    return <h1>Loading...</h1>;
  }

  // Render user profile once data is available
  return (
    <div className="dashboard-container">
      <div className="profile-section">
        {/* Display profile picture or fallback avatar */}
        <img
          src={profile.images[0]?.url || '/default-avatar.png'}
          alt="Profile"
          className="profile-image"
        />
        
        {/* Display user info */}
        <h1>Welcome, {profile.display_name}!</h1>
        <p>Email: {profile.email}</p>
        <p>Account Type: {profile.product}</p>
        <p>Total Followers: {profile.followers?.total || 0}</p>

        {/* Button container */}
        <div className="button-container">
          {/* Link to user's Spotify profile */}
          <a
            href={profile.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-profile-link"
          >
            View Spotify Profile
          </a>

          {/* Log out button */}
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
