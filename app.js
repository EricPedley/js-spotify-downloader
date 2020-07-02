

const express = require('express'); // Express web server framework
const cors = require('cors');
const spotifyAuth = require("./endpoints/spotify-auth");
const youtubeAuth = require("./endpoints/youtube-auth");
const youtubeActions = require("./endpoints/youtube-actions");
const {google} = require("googleapis");

var app = express();

app.use(express.static(__dirname + '/public'))
  .use(cors());

app.get('/spotify-login',spotifyAuth.login);
app.get('/callback', spotifyAuth.callback);

app.get('/youtube-login', youtubeAuth.login);
app.get('/youtube-callback', youtubeAuth.callback);

app.get('/youtube-list-playlists', youtubeActions.listPlaylists);
app.get('/youtube-search-and-add', youtubeActions.searchAdd);


let port = process.env.PORT || 8888;
console.log(`Listening on ${port}`);
app.listen(port);







