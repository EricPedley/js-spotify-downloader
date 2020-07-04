const querystring = require('querystring');
var spotify_client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri
module.exports = {
    login: (req, res) => {
        var scope = 'playlist-read-private';
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'token',
                client_id: spotify_client_id,
                scope: scope,
                redirect_uri: spotify_redirect_uri
            }));
    },
    callback: (req, res) => {
        res.redirect("/");
    }
}