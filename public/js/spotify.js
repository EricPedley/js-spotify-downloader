/*
How the program works in steps:
-first, the user authenticates with spotify with the button on the landing page
-after authenticating with spotify it displays all of their playlists and buttons for authenticating with google
-the user has to press the button to authenticate with google
-then they click on the playlist they want to convert(this calls the "selectSpotifyPlaylist" function)
-that brings up a list of their youtube playlists(this is done with the "listYTPlaylists" function in youtube.js)
-when they click on a youtube playlist it does the converting(with the "selectYTPlaylist" function in youtube.js, which calls the "searchAdd" function on each track)
*/
var tracks = [];
var selectedSpotifyPlaylist;
var instructions = document.getElementById('instructions');

class StarterButtons extends React.Component {
  render() {
    return (<div>
      <a href="/spotify-login" id="spotify-login" className="big-link spotify-colors">
        <h3>Log in with Spotify</h3>
      </a>
      <br></br>
      <br></br>
      <button id="import-button" className="pressable big-link">
        <h3>Or Import Tracks From JSON</h3>
      </button>
    </div>
    );
  }
}

class PlaylistSelect extends React.Component {
  render() {
    return (<div>

    </div>);
  }
}

class ImportScreen extends React.Component {
  render() {
    return (<div>

      </div>);
  }
}

class PlaylistView extends React.Compoent {
  render() {
    return (<div>

      </div>);
  }
}



document.querySelector("#import-button").onclick = function () {
  $('#spotify-login').hide();
  $('#spotify-loggedin').hide();
  $('#import-button').hide();
  document.querySelector("#import-holder").innerHTML = '<h3>Enter JSON Text Here:</h3><textarea wrap="soft" id="spotify-import"></textarea><button class="pressable small-link" id="import-submit"><h4>Import Playlist<h4></button>';
  instructions.innerHTML = "Enter the JSON formatted list of songs into the text box";
};

document.querySelector("#import-submit").onclick = function () {
  let text = document.querySelector("#spotify-import").value;
  tracks = JSON.parse(text);
  instructions.innerHTML = "Choose a Youtube Playlist";
}

function selectSpotifyPlaylist(playlistId) {//this is fired when the user selects a playlist
  loadNextPlaylistPage(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, function (response2) {
    if (selectedSpotifyPlaylist) {
      let selectedButton = document.getElementById(selectedSpotifyPlaylist);
      selectedButton.style.backgroundColor = "transparent";
      selectedButton.style.color = "#FFFFFF";
    }
    selectedSpotifyPlaylist = playlistId;
    let playlistButton = document.getElementById(playlistId);
    playlistButton.style.backgroundColor = "#1ed760";
    playlistButton.style.color = "#121212";
    if (selectedYTPlaylist) {
      displayConvertButton();
    }
  });
}

function loadNextPlaylistPage(url, callback) {
  $.ajax({//playlists
    url: url,
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    success: function (res) {
      console.log(res);
      for (let i = 0; i < res.items.length; i++) {
        let track = res.items[i].track;
        let display = track.name + " ";
        for (let artist of track.artists)
          display += artist.name;
        tracks.push(display);

      }
      if (!res.next) {
        callback(res);
      } else {
        loadNextPlaylistPage(res.next, callback);
      }
    }
  });
}

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}


var params = getHashParams();

var access_token = params.access_token,
  refresh_token = params.refresh_token,
  error = params.error;

var spotifyWindow = document.querySelector("#spotify-loggedin");

if (error) {
  alert('There was an error during the authentication');
} else {
  if (access_token) {
    $.ajax({//get user information
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function (response) {
        console.log("response to spotify auth: ", response);
        let id = response.id;
        spotifyWindow.innerHTML = `<h3 class="loggedin-message">Logged in to Spotify as ${response.display_name}</h3>`
        spotifyWindow.innerHTML += `<a id="spotify-logout" href = "/" onclick="logoutSpotify()" class = " spotify-colors logout-button small-link">Log Out</a><br>`;

        console.log(id);
        $.ajax({//get list of playlists
          url: `https://api.spotify.com/v1/users/${id}/playlists`,
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function (response2) {
            console.log("succcess of 2nd ajax");
            response2.items.forEach(function (playlist) {//this is where the playlists are rendered
              spotifyWindow.innerHTML += `<button class="pressable playlist-button small-link" id ="${playlist.id}" onclick = "selectSpotifyPlaylist('${playlist.id}');">${playlist.name}</button><br>`;
            });

          }
        });
        $('#spotify-login').hide();
        $('#spotify-loggedin').show();
        instructions.innerHTML = 'Log in with youtube to continue';
        document.querySelector("#youtube-login").href += "?spotify_params=" + window.location.href.split("=")[1];//change href of youtube button and display it so that the spotify access token doesn't disappear
        $('#youtube-login').show();
      }
    });

  } else {
    // render initial screen
    $('#spotify-login').show();
    $('#spotify-loggedin').hide();
    $('#youtube-login').hide();
  }
}

function logoutSpotify() {
  const url = 'https://www.spotify.com/logout';
  const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=10,height=10,top=0,left=0');
  setTimeout(() => spotifyLogoutWindow.close(), 1000);
}