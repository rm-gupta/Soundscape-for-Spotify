import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './dashboard.css';

export default function Dashboard() {
  const [profile, setProfile] = useState(null); // State for user profile
  const [error, setError] = useState(null); // State for error handling
  const location = useLocation();

  useEffect(() => {
    // Extract userId from the URL
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    if (userId) {
      localStorage.setItem('userId', userId); // Save userId in localStorage
    }

    // Fetch user profile
    async function fetchProfile() {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        setError('No user ID found. Please log in again.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/me?userId=${storedUserId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const data = await response.json();
        setProfile(data); // Update profile state
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please try again.');
      }
    }
    fetchProfile();
  }, [location]);

  // Show error if any
  if (error) {
    return <h1>{error}</h1>;
  }

  // Show loading state until profile is fetched
  if (!profile) {
    return <h1>Loading...</h1>;
  }

  // Render user profile
  return (
    <div className="dashboard-container">
      <div className="profile-section">
        <img src={profile.images[0]?.url || '/default-avatar.png'} alt="Profile" className="profile-image" />
        <h1>Welcome, {profile.display_name}!</h1>
        <p>Email: {profile.email}</p>
        <p>Account Type: {profile.product}</p>
        <p>Total Followers: {profile.followers?.total || 0}</p>
        <a href={profile.external_urls.spotify} target="_blank" rel="noopener noreferrer">
          View Spotify Profile
        </a>
      </div>
    </div>
  );
}
