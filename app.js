

const express = require('express'); // Express web server framework
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;

if (process.env.NODE_ENV != "production")
  require("dotenv").config();
var spotify_client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri
var youtube_client_id = process.env.YOUTUBE_CLIENT_ID;
var youtube_redirect_uri_1 = process.env.YOUTUBE_REDIRECT_URI_1;
var youtube_redirect_uri_2 = process.env.YOUTUBE_REDIRECT_URI_2;
var youtube_client_secret = process.env.YOUTUBE_CLIENT_SECRET;

var youtube_access_token;

var app = express();

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

app.get('/spotify-login', function (req, res) {

  // your application requests authorization
  var scope = 'playlist-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'token',
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: spotify_redirect_uri
    }));
});

app.get('/youtube-login', function (req, res) {
  res.redirect('https://accounts.google.com/o/oauth2/v2/auth?' +
    querystring.stringify({
      client_id: youtube_client_id,
      redirect_uri: youtube_redirect_uri_1,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/youtube.force-ssl"
    }));
});

app.get('/youtube-callback', function (req, res) {
  console.log(req.query.code);
  let data = {
    client_id: youtube_client_id,
    client_secret: youtube_client_secret,
    redirect_uri: youtube_redirect_uri_2,
    code: req.query.code,
    grant_type: "authorization_code"
  }
  let formurldata = new URLSearchParams(data).toString();
  console.log(formurldata);
  let options = {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    }
  };
  fetch('https://oauth2.googleapis.com/token',options).then(function(res){
    let json = res.json();
    console.log(res);
    youtube_access_token=json.access_token;
    console.log(youtube_access_token);
  });
});

app.get('/youtube-callback-2',function(req,res) {
  res.redirect("/");
  //console.log("req",req);
});

app.get('/youtube-list-playlists', function (req, res) {
  let data = {
    "part": "snippet",
    "mine": true
  }
  let options = {
    body: JSON.stringify(data),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${youtube_access_token}`
    }
  }
  fetch("https://www.googleapis.com/youtube/v3/playlists", options.then(function (res) {
    res.json();
  }).then(function (json) { 
    console.log("response to google playlist list call: " + JSON.stringify(json)); 
  })
  );
});

app.post('/youtube-search-and-add', function (req, res) {//TODO: make the search part use pupeteer instead of youtube's api

});

app.get('/callback', function (req, res) {
  res.redirect("/");
});

let port = process.env.PORT || 8888;
console.log(`Listening on ${port}`);
app.listen(port);







