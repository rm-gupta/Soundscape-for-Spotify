import React from 'react';

export default function LoginPage() {
  const spotifyLoginUrl = 'http://localhost:3000/login'; // Replace with your backend URL

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
    backgroundColor: '#1DB954',
    color: '#fff',
    padding: '0.8rem 1.5rem',
    borderRadius: '30px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};
