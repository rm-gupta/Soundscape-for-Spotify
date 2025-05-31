import React, { useEffect, useState } from 'react';
import './topGenres.css';


export default function TopGenres() {
    const [genres, setGenres] = useState([]); 
    const [activeRange, setActiveRange] = useState('short_term');

    useEffect(() => {
        const userId = localStorage.getItem('userId'); 
        async function fetchGenres(){
            const res = await fetch(`http://localhost:5001/api/top-genres?userId=${userId}&time_range=${activeRange}`);
            const data = await res.json(); 
            setGenres(data.items || []); 
        }

        fetchGenres(); 
    }, [activeRange]); 

    const rangeLabels = {
        short_term: 'last 4 weeks',
        medium_term: 'last 6 months',
        long_term: 'last 12 months',
      };
    
    
    return(
        <div className = "top-genres-container">
            <h1>Top Genres ({rangeLabels[activeRange]})</h1>
            <div className = "tabs">
                {Object.keys(rangeLabels).map(range => (
                    <button key={range} onClick={() => setActiveRange(range)} className={activeRange === range ? 'active' : ''}>
                        {rangeLabels[range]}
                    </button>
                ))}
            </div>
            <ul className="genre-list">
                {genres.map(({ genre, count }, index) => (
                    <li key={genre} className="genre-item">
                        <span className="genre-rank">{index + 1}. {genre}</span>
                        <div className="genre-bar" style={{ width: `${count * 20}px` }} /> {/* Adjust scaling */}
                     </li>
                 ))}
            </ul>
        </div>
    ); 
}
