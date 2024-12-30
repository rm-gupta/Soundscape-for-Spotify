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
const port = process.env.PORT || 5000;
const userTokens = {}; // In-memory storage for user tokens

const app = express();
const cors = require('cors');
app.use(cors());
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

  const scope = 'user-read-private user-read-email';

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
    res.redirect(`http://localhost:3000/dashboard?userId=${userId}`);
  } catch (error) {
    console.error('Error during token exchange or profile fetch:', error.response?.data || error.message);
    res.redirect('/#error=invalid_token');
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
