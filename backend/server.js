const express = require('express');
const querystring = require('querystring');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config(); // Load environment variables from .env

var client_id = process.env.CLIENT_ID;
var redirect_uri = process.env.REDIRECT_URI;
const client_secret = process.env.CLIENT_SECRET;
const port = process.env.PORT || 3000;

var app = express();

// Function to generate a random string 
function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
    
});

//Handling the callback to 
app.get('/callback', function(req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;
  
    if (state === null) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
    }
  });
