console.log("gapi code ran");


function searchAdd(searchTerm, playlistId) {//searches for a song and adds it to the playlist
  console.log(`SearchAdd being run`);
  return gapi.client.youtube.search.list({
    "part": "snippet",
    "maxResults": 1,
    "type": "video",
    "q": searchTerm
  })
    .then(function (response) {
      // Handle the results here (response.result has the parsed body).
      console.log("Response", response);
      console.log(`video id for ${searchTerm}:`, response.result.items[0].id.videoId);
      let id = response.result.items[0].id.videoId
      gapi.client.youtube.playlistItems.insert({
        "part": [
          "snippet"
        ],
        "resource": {
          "snippet": {
            "playlistId": playlistId,
            "resourceId": {
              "kind": "youtube#video",
              "videoId": id
            }
          }
        }
      }).then(function(response) {
        console.log(`response to playlist insert for ${searchTerm}:`,response);
      }, function(err) {console.log("Error",err);});
    },
      function (err) { console.error("Execute error", err); });
  }

function listYTPlaylists() {
  return gapi.client.youtube.playlists.list({
    "part": "snippet",
    "mine": true
  })
    .then(function (response) {
      // Handle the results here (response.result has the parsed body).
      console.log("Response", response);
      var holder = document.querySelector("#ytplaylists");
      response.result.items.forEach(function(playlist) {
        holder.innerHTML+=`<a onclick = "selectYTPlaylist('${playlist.id}')">${playlist.snippet.title} - ${playlist.id}</a>`
      });
    },
      function (err) { console.error("Execute error", err); });
}

function selectYTPlaylist(ytPlaylistID) {
  tracks.forEach(function (item) {//for each track in the playlist
        let track = item.track;
        let ytquery = track.name + " ";
        track.artists.forEach(function (artist) {
          ytquery += `${artist.name} `;
        });
        searchAdd(ytquery,ytPlaylistID);//this function is in gapi.js
        //get requests for yt links don't work because they're blocked by CORS policy of youtube
      });
}

gapi.load("client:auth2", function () {
  gapi.auth2.init({ client_id: "839379896220-e9sg0d121d4f4ib4t5tpmcj0gidl36ag.apps.googleusercontent.com" });//this clientid is from the youtube data api
});

function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
    .then(function () { console.log("Sign-in successful"); },
      function (err) { console.error("Error signing in", err); });
}
function loadClient() {
  gapi.client.setApiKey("");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function () { console.log("GAPI client loaded for API"); },
      function (err) { console.error("Error loading GAPI client for API", err); });
}