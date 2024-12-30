import React, { useEffect, useState } from 'react';

export default function TopArtists() {
  const [shortTerm, setShortTerm] = useState([]);
  const [mediumTerm, setMediumTerm] = useState([]);
  const [longTerm, setLongTerm] = useState([]);

  useEffect(() => {
    async function fetchTopArtists(timeRange, setter) {
      const userId = localStorage.getItem('userId'); // Get the user ID
      try {
        const response = await fetch(`http://localhost:5000/api/top-artists?userId=${userId}&time_range=${timeRange}&limit=10`);
        const data = await response.json();
        setter(data.items); // Set the fetched data to the corresponding state
      } catch (error) {
        console.error(`Error fetching top artists for ${timeRange}:`, error);
      }
    }

    fetchTopArtists('short_term', setShortTerm); // Last 4 weeks
    fetchTopArtists('medium_term', setMediumTerm); // Last 6 months
    fetchTopArtists('long_term', setLongTerm); // All time
  }, []);

  return (
    <div>
      <h1>Your Top Artists</h1>

      <section>
        <h2>Short-Term (Last 4 Weeks)</h2>
        <ul>
          {shortTerm.map((artist) => (
            <li key={artist.id}>
              <img src={artist.images[0]?.url} alt={artist.name} style={{ width: 50, height: 50 }} />
              <p>{artist.name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Medium-Term (Last 6 Months)</h2>
        <ul>
          {mediumTerm.map((artist) => (
            <li key={artist.id}>
              <img src={artist.images[0]?.url} alt={artist.name} style={{ width: 50, height: 50 }} />
              <p>{artist.name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Long-Term (All Time)</h2>
        <ul>
          {longTerm.map((artist) => (
            <li key={artist.id}>
              <img src={artist.images[0]?.url} alt={artist.name} style={{ width: 50, height: 50 }} />
              <p>{artist.name}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
