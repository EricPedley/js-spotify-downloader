# Spotify to Youtube Playlist Converter

I remade this project using react at https://github.com/EricPedley/spotify-yt-react. This version has basically the same functionality but with a less developed UI. I remade it in react because building single page functionality with vanilla javascript was getting too unmaintainable.

How to set up:
This project uses the youtube data api v3 and spotify's api. You need api credentials from both. 
To use the program you need these environment variables. If you're hosting on a cloud provider you can usually set them up there or locally create a .env file:
NODE_ENV={local if you're testing, production in hosted(setting to production means app.js won't expect a .env file)};
SPOTIFY_CLIENT_ID={your spotify client id}
SPOTIFY_REDIRECT_URI={your url}/callback(example: http://localhost:8888/callback)
YOUTUBE_CLIENT_ID={your youtube client id}
YOUTUBE_CLIENT_SECRET={your youtube client secret
YOUTUBE_REDIRECT_URI={your url}/youtube-callback(example: http://localhost:8888/youtube-callback)
