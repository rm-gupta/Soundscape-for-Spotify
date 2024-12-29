// export default function TopArtists() {
//     const [timeframe, setTimeframe] = useState('4weeks');
  
//     const artistsData = {
//       '4weeks': [
//         { name: 'Taylor Swift', image: 'https://via.placeholder.com/150', rank: 1 },
//         { name: 'Drake', image: 'https://via.placeholder.com/150', rank: 2 },
//         { name: 'Adele', image: 'https://via.placeholder.com/150', rank: 3 },
//       ],
//     };
  
//     console.log('Current Timeframe:', timeframe); // Debugging
//     console.log('Artists Data:', artistsData[timeframe]); // Debugging
  
//     return (
//       <Container>
//         <h1>Top Artists Page</h1>
//         <Row>
//           {artistsData[timeframe].map((artist, index) => (
//             <Col key={index} xs={12} sm={6} md={4} lg={3}>
//               <ArtistCard artist={artist} />
//             </Col>
//           ))}
//         </Row>
//       </Container>
//     );
//   }
  