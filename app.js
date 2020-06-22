

var express = require('express'); // Express web server framework
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request');

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
  res.redirect('https://accounts.google.com/o/oauth2/v2/auth' +
    querystring.stringify({
      client_id:youtube_client_id,
      redirect_uri: youtube_redirect_uri_1,
      response_type:"code",
      scope:"https://www.googleapis.com/auth/youtube.force-ssl"
    }));
});

app.get('/youtube-callback', function(req,res) {
  let data = {
    client_id:youtube_client_id,
    client_secret:youtube_client_secret,
    redirect_uri:youtube_redirect_uri_2,
    code:req.params.code,
    grant_type:"authorization_code"
  }
  let options = {
    uri:'https://oauth2.googleapis.com/token',
    body:JSON.stringify(data),
    method:"POST",
    headers: {
      "Content-Type":"application/json"
    }
  };
  request(options,function(err,res) {
    youtube_access_token=res.access_token;
  });
});

app.get('/youtube-list-playlists', function(req,res) {

});

app.post('/youtube-search-and-add', function(req,res) {//TODO: make the search part use pupeteer instead of youtube's api

});

app.get('/callback', function (req, res) {
  res.redirect("/");
});

let port = process.env.PORT || 8888;
console.log(`Listening on ${port}`);
app.listen(port);
