const express = require('express');
const querystring = require('querystring');
const dotenv = require('dotenv');
const crypto = require('crypto');
const axios = require('axios');
const cookieParser = require('cookie-parser');

dotenv.config(); // Load environment variables from .env

const client_id = process.env.CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;
const client_secret = process.env.CLIENT_SECRET;
const port = process.env.PORT || 5001;
const userTokens = {}; // In-memory storage for user tokens

const app = express();
const cors = require('cors');
//app.use(cors());
app.use(cors({
  origin: 'https://soundscape-for-spotify-2t6x.vercel.app',
  credentials: true
}))
app.use(cookieParser());

// Function to generate a random string
function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const stateKey = 'spotify_auth_state';

// Login Route
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state); // Store the state in a cookie for validation

  const scope = 'user-top-read user-read-email user-read-private user-read-recently-played';

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
        show_dialog: true, // Force the login dialog
      })
  );
});

// Callback Route
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    console.error('State mismatch');
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    return;
  }

  res.clearCookie(stateKey);

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // Fetch user profile
    const userInfoResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userId = userInfoResponse.data.id;

    // Store tokens in memory
    userTokens[userId] = {
      access_token,
      refresh_token,
      expires_at: Date.now() + 3600 * 1000, // Set expiration time
    };

    console.log(`Tokens stored for user: ${userId}`, userTokens[userId]);

    // Redirect to the dashboard with userId as a query parameter
    res.redirect(`https://soundscape-for-spotify-2t6x.vercel.app/dashboard?userId=${userId}`);
  } catch (error) {
    console.error('Error during token exchange or profile fetch:', error.response?.data || error.message);
    res.redirect('/#error=invalid_token');
  }
});

//top artist route 
app.get('/api/top-artists', async (req, res) => {
  //get the parameters from the query 
  const {userId, time_range, limit} = req.query; 
  //see if we have a token stored for the user 
  if(!userTokens[userId]){
    return res.status(401).send('User not logged in');
  }

  try{
  //refresh or get valid access token for spotify 
  console.log(`Fetching top artists for userId: ${userId}, range: ${time_range}`);
  console.log('Tokens:', userTokens[userId]);
  const access_token = await getAccessToken(userId); 

  //make request to Spotify's top artists endpoint 
  const response = await axios.get('https://api.spotify.com/v1/me/top/artists', 
    {headers: {
      Authorization: `Bearer ${access_token}`
    },
    params: {
      time_range, 
      limit //how many artists to return, limit is 10 
    }
}); 

  //return data back to the frontend 
  res.json({items: response.data.items});

} catch (error) {
  //if something goes wrong, log error and send 500 response 
  console.error('Error fetching top artists:', error.response?.data || error.message);
  res.status(500).json({ error: error.response?.data || error.message });
  
}
}); 

//topTracks route
// topTracks route
app.get('/api/top-tracks', async (req, res) => {
  // get the parameters from the request 
  const { userId, time_range, limit } = req.query;

  // see if there's a token for the user already 
  if (!userTokens[userId]) {
    return res.status(401).send('User not logged in');
  }

  try {
    // get an access token for the user 
    const access_token = await getAccessToken(userId);

    // log for debugging 
    console.log(`Fetching top tracks for userId: ${userId}, range: ${time_range}`);
    console.log('Tokens:', userTokens[userId]);

    // request to Spotify API for top tracks 
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        Authorization: `Bearer ${access_token}` // attach access token
      },
      params: {
        time_range, // short_term, medium_term, long_term
        limit       // how many tracks to fetch
      }
    });

    // return data to front end 
    res.json({ items: response.data.items });

  } catch (error) {
    // log error details 
    console.error('Error fetching top tracks', error.response?.data || error.message);

    // show server error 
    res.status(500).send('Failed to fetch top tracks');
  }
});

//recently played route
app.get('/api/recently-played', async (req, res) => {
  const {userId} = req.query; 

  //if the user isn't logged in 
  if(!userTokens[userId]){
    return res.status(401).send('User not logged in');
  }

  try{
    // get an access token for the user 
    const access_token = await getAccessToken(userId); 

    // request to Spotify API for recently played tracks 
    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${access_token}` // attach access token
      },
      params: {
        limit: 50 //max is 50
      }
    });

    // return data to front end 
    res.json({ items: response.data.items });
  } catch (error){
      console.error('Error fetching recently played:', error.response?.data || error.message);
      res.status(500).send('Failed to fetch recently played tracks');
  }
}); 

//top genre route 
app.get('/api/top-genres', async (req, res) => {
  const {userId, time_range = 'short_term', limit = 50} = req.query; 

  //if the user isn't logged in 
  if(!userTokens[userId]){
    return res.status(401).send('User not logged in');
  }

  try{
    // get an access token for the user 
    const access_token = await getAccessToken(userId); 

    // request to Spotify API for recently played tracks 
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${access_token}` // attach access token
      },
      params: {
        time_range, 
        limit
      }
    });

    // return data to front end 
    const artists = response.data.items; 

    //flatten and count genres 
    const genreCount = {}; 
    artists.forEach(artist => {
      artist.genres.forEach(genre => {
        //if genre exists, add 1, else initialize 
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
      
    });
    //convert into a sorted array 
    const sortedGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1]) //sort by count descending 
      .map(([genre, count], index) => ({
        rank: index + 1, //add ranking 
        genre,
        count
    }));
    //return the result to the front end 
    res.json({ items: sortedGenres });
    
  } catch (error){
      console.error('Error fetching recently played:', error.response?.data || error.message);
      res.status(500).send('Failed to fetch recently played tracks');
  }
}); 


// Refresh Token Logic
async function getAccessToken(userId) {
  const tokens = userTokens[userId];
  if (!tokens) {
    throw new Error('User not logged in');
  }

  // Check if token has expired
  if (Date.now() > tokens.expires_at) {
    console.log('Access token expired. Refreshing...');
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: tokens.refresh_token,
      }),
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const newAccessToken = response.data.access_token;
    tokens.access_token = newAccessToken;
    tokens.expires_at = Date.now() + 3600 * 1000; // Reset expiration time
    console.log(`Refreshed token for user: ${userId}`);
  }

  return tokens.access_token;
}

// API Route to Fetch User Info
app.get('/api/me', async (req, res) => {
  const { userId } = req.query;
  console.log('Received request for user ID:', userId);

  if (!userId) {
    console.error('No userId provided');
    return res.status(400).send('User ID is required');
  }

  try {
    const access_token = await getAccessToken(userId);
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    console.log('Spotify user data:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching user info:', error.response?.data || error.message);
    res.status(500).send('Failed to fetch user info');
  }
});

// Validating the user ID before the start of the session
app.get('/api/validate-session', (req, res) => {
  const { userId } = req.query;

  if (!userId || !userTokens[userId]) {
    console.warn(`Invalid session for userId: ${userId}`);
    return res.status(401).send('Session invalid');
  }

  res.send('Session valid');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
