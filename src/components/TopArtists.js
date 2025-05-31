import React, { useEffect, useState } from 'react';
import './topArtists.css';


export default function TopArtists() {
  const [shortTerm, setShortTerm] = useState([]);
  const [mediumTerm, setMediumTerm] = useState([]);
  const [longTerm, setLongTerm] = useState([]);
  //hold the currently selected time range 
  const [activeRange, setActiveRange] = useState('short_term')

  useEffect(() => {
    //fetch top artists for a specific time range 
    async function fetchTopArtists(timeRange, setter, limit) {
      const userId = localStorage.getItem('userId'); // Get the user ID
      try {
        //call backend with time range and user ID 
        const response = await fetch(`https://soundscape-backend-tc9o.onrender.com/api/top-artists?userId=${userId}&time_range=${timeRange}&limit=${limit}`
        );
        //fix to error handling 
        if(!response.ok){
          const errorText = await response.text(); 
          throw new Error(errorText);
        }
        
        const data = await response.json();
        console.log('Data for ${timeRange}:', data);
        setter(data.items); // Set the fetched data to the corresponding state
      } catch (error) {
        console.error(`Error fetching top artists for ${timeRange}:`, error);
      }
    } 

    fetchTopArtists('short_term', setShortTerm, 15); // Last 4 weeks
    fetchTopArtists('medium_term', setMediumTerm, 50); // Last 6 months
    fetchTopArtists('long_term', setLongTerm, 50); // All time
  }, []);

  //pick the correct artist list based on what tab is selected 
  const getArtists = () => {
    switch(activeRange) {
      case 'short_term': return shortTerm; 
      case 'medium_term': return mediumTerm; 
      case 'long_term': return longTerm; 
      default: return []; 
    }
  };

  //mapping to show readable labels 
  const rangeLabels = {
    short_term: 'last 4 weeks',
    medium_term: 'last 6 months', 
    long_term: 'last 12 months'
  }; 

  return (
    //title to show the currently selected time range 
    <div className="top-artists-container">
      <h1> Your Top Artists ({rangeLabels[activeRange]})</h1>

      {/* tab buttons to switch between the time ranges */}
      <div className="tabs">
        {Object.keys(rangeLabels).map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className={activeRange === range ? 'active' : ''}
          >
            {rangeLabels[range]}
          </button>
        ))}
      </div>


        {/* get the artist list for the selected time range */}
        <ul className="top-artists-grid">
  {getArtists().map((artist, index) => (
      <a
        key={artist.id}
        href={artist.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className="artist-card-link"
      >
        <li className="artist-card">
          <img src={artist.images[0]?.url} alt={artist.name} />
          <p>{index + 1}. {artist.name}</p>
        </li>
    </a>
  ))}
</ul>
    </div>
  ); 
}
