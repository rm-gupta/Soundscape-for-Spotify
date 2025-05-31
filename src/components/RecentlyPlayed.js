import React, { useEffect, useState } from 'react';
import './recentlyPlayed.css';

//components for recently played 
export default function RecentlyPlayed() {
    const [tracks, setTracks] = useState([]); 
    useEffect(() => {
        //get stored userID
        const userId = localStorage.getItem('userId'); 

        //get the recently played tracks from the backend 
        async function fetchRecentlyPlayed(){
            try{
            //GET request to backend API with the userID
            const res = await fetch(`http://localhost:5001/api/recently-played?userId=${userId}`); 
            //parsing through the JSON response 
            const data = await res.json(); 
            console.log("Recently Played Response:", data);
            setTracks(data.items || []); 
            } catch (err) {
                console.error('Error fetching recently played tracks:', err); 
            }
        }
        //once component is mounted, call the fetch function
        fetchRecentlyPlayed(); 
    }, []); 

    return (
        <div className = "recently-played-container">
            <h1> Recently Played Tracks</h1>

            <table className = "recently-played-table">
                <thead>
                    <tr>
                        <th>Track</th>
                        <th>Artist(s)</th>
                        <th>Played at</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((item, idx) => {
                        const track = item.track; //get track details 
                        const playedAt = new Date(item.played_at).toLocaleString(); //format played time

                        return (
                            <tr
                            key={track.id + idx}
                            onClick={() => window.open(track.external_urls.spotify, '_blank')}
                            style={{ cursor: 'pointer' }}
                            >
                            <td>{track.name}</td>
                            <td>{track.artists.map(a => a.name).join(', ')}</td>
                            <td>{playedAt}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}