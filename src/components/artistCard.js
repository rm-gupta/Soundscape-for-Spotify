import React from 'react';
import { Card } from 'react-bootstrap';
import './artistCard.css'; 

export default function ArtistCard({ artist }) {
  return (
    <Card className="artist-card">
      {/* Artist Image */}
      <Card.Img variant="top" src={artist.image} alt={artist.name} />
      <Card.Body>
        {/* Artist Name */}
        <Card.Title className="text-center">{artist.name}</Card.Title>
        {/*  Artist Stats */}
        <Card.Text className="text-center">
          Rank: {artist.rank}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
