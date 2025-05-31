import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true); // State to track session check
  const spotifyLoginUrl = 'http://localhost:5001/login'; // Replace with your backend URL

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Validate session with the backend
      fetch(`http://localhost:5001/api/validate-session?userId=${userId}`)
        .then((response) => {
          if (response.ok) {
            navigate('/dashboard'); // Redirect to dashboard if session is valid
          } else {
            console.warn('Invalid session. Staying on login page.');
            localStorage.removeItem('userId'); // Clear invalid session
          }
        })
        .catch((error) => console.error('Error validating session:', error))
        .finally(() => setCheckingSession(false)); // Stop checking session
    } else {
      setCheckingSession(false); // No userId, show login page
    }
  }, [navigate]);

  if (checkingSession) return <h1>Loading...</h1>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login to Spotify</h1>
      <p style={styles.description}>
        Connect your Spotify account to access personalized stats and features.
      </p>
      <a href={spotifyLoginUrl} style={styles.button}>
        Login with Spotify
      </a>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#fff',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    maxWidth: '500px',
    lineHeight: '1.6',
  },
  button: {
    backgroundColor: '#09a741',
    color: '#fff',
    padding: '0.8rem 1.5rem',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};
