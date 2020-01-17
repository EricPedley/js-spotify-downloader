function choose(playlistId, access_token) {
    $.ajax({//playlists
      url: `https://api.spotify.com/v1/playlists/${playlistId}`,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function (response2) {
        console.log("playlist grabbing ajax worked");
        console.log(response2);
        response2.tracks.items.forEach(function (item) {
          let track = item.track;
          let ytquery = "" + track.name;
          track.artists.forEach(function (artist) {
            ytquery += `+${artist.name}`;
          });
          ytquery = ytquery.replace(/ /g, '+');
          let ytsearch = `https://www.youtube.com/results?search_query=${ytquery}`;
          console.log(ytsearch);
          //get requests for yt links don't work because they're blocked by CORS policy of youtube
        });
      }
    });
  }
  (function () {

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
                response2.items.forEach(function (playlist) {
                  userProfilePlaceholder.innerHTML += `<dt><a onclick = "choose('${playlist.id}','${access_token}')">${playlist.name} - ${playlist.id}</a></dt>`;
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