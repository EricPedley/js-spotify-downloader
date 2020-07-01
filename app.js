

const express = require('express'); // Express web server framework
const cors = require('cors');
const spotifyAuth = require("./spotify-auth");
const youtubeAuth = require("./youtube-auth");
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

app.get('/youtube-list-playlists', function (req, res) {
 youtube.playlists.list({part:"snippet",mine:true}).then(function(ytres) {
   res.send(ytres.data);
 }).catch(function(error){console.error(error)});
});

app.post('/youtube-search-and-add', function (req, res) {//TODO: make the search part use pupeteer instead of youtube's api

});


let port = process.env.PORT || 8888;
console.log(youtube);
console.log(`Listening on ${port}`);
app.listen(port);







