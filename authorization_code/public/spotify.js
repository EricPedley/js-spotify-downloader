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
function selectSpotifyPlaylist(playlistId, access_token) {//this is fired when the user selects a playlist
  $.ajax({//playlists
    url: `https://api.spotify.com/v1/playlists/${playlistId}`,
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    success: function (response2) {
      console.log("playlist grabbing ajax worked");
      console.log(response2);
      listYTPlaylists();//this is in gapi.js, it lists the user's youtube playlists
      tracks = response2.tracks.items;//this value is used in gapi.js
    }
  });
}
(function () {//I don't know why this is a function instead of just in the body

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

  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById('user-profile');

  var oauthSource = document.getElementById('oauth-template').innerHTML,
    oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById('oauth');

  var params = getHashParams();

  var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });

      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);
          let id = response.id;
          console.log(id);
          $.ajax({//playlists
            url: `https://api.spotify.com/v1/users/${id}/playlists`,
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function (response2) {
              console.log("succcess of 2nd ajax");
              response2.items.forEach(function (playlist) {//this is where the playlists are rendered
                userProfilePlaceholder.innerHTML += `<dt><a onclick = "selectSpotifyPlaylist('${playlist.id}','${access_token}')">${playlist.name} - ${playlist.id}</a></dt>`;
              });

            }
          });
          $('#login').hide();
          $('#loggedin').show();

        }
      });

    } else {
      // render initial screen
      $('#login').show();
      $('#loggedin').hide();
    }

    document.getElementById('obtain-new-token').addEventListener('click', function () {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refresh_token
        }
      }).done(function (data) {
        access_token = data.access_token;
        oauthPlaceholder.innerHTML = oauthTemplate({
          access_token: access_token,
          refresh_token: refresh_token
        });
      });
    }, false);
  }
})();