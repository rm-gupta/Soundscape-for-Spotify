import React, {useEffect, useState} from 'react'; 
import './topTracks.css'; 

export default function TopTracks(){
    //state variables for each time range 
    //initialize with empty arr
    const [shortTerm, setShortTerm] = useState([]); 
    const [mediumTerm, setMediumTerm] = useState([]); 
    const [longTerm, setLongTerm] = useState([]); 

    //currently active time range 
    const[activeRange, setActiveRange] = useState('short_term'); 

    //Fetch top tracks when the component mounts 
    useEffect(() => {
        const userId = localStorage.getItem('userId');

        //get the top tracks from backend 
        async function fetchTopTracks(timeRange, setter){
           try{
            const response = await fetch(
                `https://soundscape-backend-tc9o.onrender.com/api/top-tracks?userId=${userId}&time_range=${timeRange}&limit=50`
              );
            const data = await response.json(); 
            setter(data.items);
        } catch (error){
            console.error(`Error fetching top tracks for ${timeRange}:`, error);
        }
    }
    
    //when component loads, get all time ranges 
    fetchTopTracks('short_term', setShortTerm);
    fetchTopTracks('medium_term', setMediumTerm);
    fetchTopTracks('long_term', setLongTerm);
    }, []); 


//based on the tab get the right track list 
const getTracks = () => {
    switch(activeRange) {
        case 'short_term':
            return shortTerm;
        case 'medium_term':
            return mediumTerm;
        case 'long_term':
            return longTerm; 
        default: 
            return []; 
    }
}; 

//label mapping 
const rangeLabels = {
    short_term: 'last 4 weeks',
    medium_term: 'last 6 months',
    long_term: 'last 12 months',
  };

  return (
    <div className = "top-tracks-container">
        <h1> Top Tracks ({rangeLabels[activeRange]})</h1>
    <div className = "tabs">
        {Object.keys(rangeLabels).map((range) => (
            <button
                key = {range}
                onClick = {() => setActiveRange(range)} //to update selected range
                className = {activeRange === range ? 'active': ''} //apply active
            >
             {rangeLabels[range]}
            </button>
        ))}
        </div>

      {/* List of tracks */}
      <ol className="track-list">
        {getTracks().map((track, index) => (
          <li key={track.id} className="track-item">
            <span className="rank">{index + 1}</span> {/* Track rank */}
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="track-link"
            >
              <img
                src={track.album.images[0]?.url}
                alt={track.name}
                className="track-img"
              />
            <div className="track-info">
              <div className="track-name">{track.name}</div>
              <div className="track-artist">
              {track.artists.map((artist) => artist.name).join(', ')}
            </div>
          </div>
        </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

