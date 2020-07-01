const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
var youtube_client_id = process.env.YOUTUBE_CLIENT_ID;
var youtube_redirect_uri = process.env.YOUTUBE_REDIRECT_URI;
var youtube_client_secret = process.env.YOUTUBE_CLIENT_SECRET;
var oauth2Client = new OAuth2(youtube_client_id,youtube_client_secret,youtube_redirect_uri);
module.exports = {
    oauth2Client: oauth2Client,
    login: function (req, res) {
        res.redirect(oauth2Client.generateAuthUrl({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" }));
    },
    callback: function (req, res) {
        console.log(req.query.code);
        oauth2Client.getToken(req.query.code, function (err, token) {
            oauth2Client.setCredentials(token);
        });
        res.redirect("/");
    }
}