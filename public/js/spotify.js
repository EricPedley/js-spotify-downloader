/*
How the program works in steps:
-first, the user authenticates with spotify with the button on the landing page
-after authenticating with spotify it displays all of their playlists and buttons for authenticating with google
-the user has to press the button to authenticate with google
-then they click on the playlist they want to convert(this calls the "selectSpotifyPlaylist" function)
-that brings up a list of their youtube playlists(this is done with the "listYTPlaylists" function in gapi.js)
-when they click on a youtube playlist it does the converting(with the "selectYTPlaylist" function in gapi.js, which calls the "searchAdd" function on each track)
*/
var tracks;
var selectedSpotifyPlaylist;
var instructions = document.getElementById('instructions');
function selectSpotifyPlaylist(playlistId) {//this is fired when the user selects a playlist
  $.ajax({//playlists
    url: `https://api.spotify.com/v1/playlists/${playlistId}`,
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    success: function (response2) {
      if (selectedSpotifyPlaylist) {
        let selectedButton = document.getElementById(selectedSpotifyPlaylist);
        selectedButton.style.backgroundColor = "transparent";
        selectedButton.style.color = "#FFFFFF";
      }
      selectedSpotifyPlaylist = playlistId;
      let playlistButton = document.getElementById(playlistId);
      playlistButton.style.backgroundColor = "#1ed760";
      playlistButton.style.color = "#121212";
      tracks = response2.tracks.items;//this value is used in gapi.js
      if (selectedYTPlaylist) {
        displayConvertButton();
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

    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function (response) {
        console.log("response to spotify auth: ", response);
        let id = response.id;
        spotifyWindow.innerHTML = `<h3 class="loggedin-message">Logged in to Spotify as ${response.display_name}</h3>`
        spotifyWindow.innerHTML += `<a id="spotify-logout" href = "/" onclick="logoutSpotify()">Log Out</a><br>`;

        console.log(id);
        $.ajax({//playlists
          url: `https://api.spotify.com/v1/users/${id}/playlists`,
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function (response2) {
            console.log("succcess of 2nd ajax");
            renderSpotifyPlaylists(response2.items);
            instructions.innerHTML = 'Log in with youtube to continue';
            response2.items.forEach(function (playlist) {//this is where the playlists are rendered
              spotifyWindow.innerHTML += `<button class="pressable playlist-button" id ="${playlist.id}" onclick = "selectSpotifyPlaylist('${playlist.id}');">${playlist.name}</button><br>`;
            });

          }
        });
        $('#spotify-login').hide();
        $('#spotify-loggedin').show();
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

function renderSpotifyPlaylists(playlists) {
  playlists.forEach(function (playlist) {
    $("#spotifyhalf").innerHTML += `<dt><a onclick = "selectSpotifyPlaylist('${playlist.id}','${access_token}')">${playlist.name} - ${playlist.id}</a></dt>`;
  });
}

function logoutSpotify() {
  const url = 'https://www.spotify.com/logout';
  const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=10,height=10,top=0,left=0');
  setTimeout(() => spotifyLogoutWindow.close(), 1000);
}


// document.getElementById('obtain-new-token').addEventListener('click', function () {
  //   $.ajax({
  //     url: '/refresh_token',
  //     data: {
  //       'refresh_token': refresh_token
  //     }
  //   }).done(function (data) {
  //     access_token = data.access_token;
  //     oauthPlaceholder.innerHTML = oauthTemplate({
  //       access_token: access_token,
  //       refresh_token: refresh_token
  //     });
  //   });
  // }, false);