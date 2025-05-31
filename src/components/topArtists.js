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
        const response = await fetch(`http://localhost:5001/api/top-artists?userId=${userId}&time_range=${timeRange}&limit=${limit}`
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
    <div style = {{textAlign: 'center'}}>
      <h1> Your Top Artists ({rangeLabels[activeRange]})</h1>

      {/* tab buttons to switch between the time ranges */}
      <div style = {{ display: 'flex', justifyContent: 'center', gap: '1rem', 
        marginBottom: '2rem'}}>
          {/* renders 3 buttons, one for each time range*/}
          {Object.keys(rangeLabels).map((range) => (
              <button
                key = {range}
                onClick = {() => setActiveRange(range)} //update range when clicked
                style = {{
                  padding: '0.5rem 1rem',
                  borderBottom: activeRange === range ? '2px solid white' : 'none', // Highlight active tab
                  background: 'none',
                  color: 'white',
                  fontWeight: activeRange === range ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
              >
                {rangeLabels[range]} {/* show label text */}
              </button>
          ))}
    </div>

        {/* get the artist list for the selected time range */}
        <ul className="top-artists-grid">
  {getArtists().map((artist, index) => (
    <li key={artist.id} className="artist-card">
      <img src={artist.images[0]?.url} alt={artist.name} />
      <p>{index + 1}. {artist.name}</p>
    </li>
  ))}
</ul>
    </div>
  ); 
}
