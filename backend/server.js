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
const port = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());

// Function to generate a random string
function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const stateKey = 'spotify_auth_state';

app.get('/login', function (req, res) {
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
      })
  );
});

app.get('/callback', async function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
    return;
  }

  res.clearCookie(stateKey); // Clear the state cookie after validation

  try {
    const response = await axios.post(
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

    const { access_token, refresh_token } = response.data;

    // Redirect to your app or send tokens to the client
    res.redirect(
      '/#' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
        })
    );
  } catch (error) {
    console.error('Error exchanging authorization code:', error.response?.data || error.message);
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'invalid_token',
        })
    );
  }
});

const path = require('path');

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all handler for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
