/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '1855a279160e4bb68cc967d94730a324'; // Your client id
var client_secret = '6fec108743684508a52021ea5309b44b'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri



var app = express();

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

app.get('/login', function (req, res) {

  // your application requests authorization
  var scope = 'playlist-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'token',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    }));
});

app.get('/callback',function(req,res) {
  res.redirect("/");
});

let port = process.env.PORT||8888;
console.log(`Listening on ${port}`);
app.listen(port);
