

const express = require('express'); // Express web server framework
const cors = require('cors');
const spotifyAuth = require("./spotify-auth");
const youtubeAuth = require("./youtube-auth");
const youtubeActions = require("./youtube-actions")
const {google} = require("googleapis");
const youtube = google.youtube({
  version: 'v3',
  auth: youtubeAuth.oauth2Client
});

var app = express();

app.use(express.static(__dirname + '/public'))
  .use(cors());

app.get('/spotify-login',spotifyAuth.login);
app.get('/callback', spotifyAuth.callback);

app.get('/youtube-login', youtubeAuth.login);
app.get('/youtube-callback', youtubeAuth.callback);

app.get('/youtube-list-playlists', youtubeActions.listPlaylists);
app.post('/youtube-search-and-add', youtubeActions.searchAdd);


let port = process.env.PORT || 8888;
console.log(`Listening on ${port}`);
app.listen(port);







