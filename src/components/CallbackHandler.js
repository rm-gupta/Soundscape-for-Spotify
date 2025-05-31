import { useEffect } from 'react';

export default function CallbackHandler() {
  useEffect(() => {
    const query = window.location.search;
    window.location.href = `https://soundscape-backend-tc9o.onrender.com/callback${query}`;
  }, []);

  return <h1>Redirecting...</h1>;
}
