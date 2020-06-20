console.log("gapi code ran");

var youtubeScreen = document.querySelector("#youtube-loggedin");
var selectedYTPlaylist;

function searchAdd(searchTerm, playlistId) {//searches for a song and adds it to the playlist
  console.log(`SearchAdd being run`);
  return gapi.client.youtube.search.list({
    "part": "snippet",
    "maxResults": 1,
    "type": "video",
    "q": searchTerm
  }).then(function (response) {//this is the response to the search api call
      // console.log("Response", response);
      // console.log(`video id for ${searchTerm}:`, response.result.items[0].id.videoId);
      let id = response.result.items[0].id.videoId;
      console.log(`id for ${searchTerm}: ${id}`);
      return gapi.client.youtube.playlistItems.insert({
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
      });
    });
}

function listYTPlaylists() {
  return gapi.client.youtube.playlists.list({
    "part": "snippet",
    "mine": true
  })
    .then(function (response) {
      // Handle the results here (response.result has the parsed body).
      console.log("Response", response);
      youtubeScreen.innerHTML = `<h3 class = "loggedin-message">Logged in to Youtube as ${response.result.items[0].snippet.channelTitle}</h3>`;
      youtubeScreen.innerHTML += `<a id="youtube-logout" href = "${window.location.href}" onclick = "window.location.reload()">Log Out</a><br>`;
      response.result.items.forEach(function (playlist) {
        youtubeScreen.innerHTML += `<button id = '${playlist.id}' class = "pressable playlist-button" onclick = "selectYTPlaylist('${playlist.id}');">${playlist.snippet.title}</button><br>`
      });
    },
      function (err) { console.error("Execute error", err); });
}

function selectYTPlaylist(ytPlaylistID) {
  if (selectedYTPlaylist) {
    document.getElementById(selectedYTPlaylist).style.backgroundColor = "transparent";
  }
  selectedYTPlaylist = ytPlaylistID;
  document.getElementById(ytPlaylistID).style.backgroundColor = "#FF0000";
  if (selectedSpotifyPlaylist) {
    displayConvertButton();
  }
}

gapi.load("client:auth2", function () {
  gapi.auth2.init({ client_id: "839379896220-e9sg0d121d4f4ib4t5tpmcj0gidl36ag.apps.googleusercontent.com" });//this clientid is from the youtube data api
});

function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
    .then(function () {
      console.log("Sign-in successful");

    },
      function (err) { console.error("Error signing in", err); });
}
function loadClient() {
  gapi.client.setApiKey("");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function () {
      $('#youtube-login').hide();
      $('#youtube-loggedin').show();
      listYTPlaylists();
      instructions.innerHTML = "Select playlists to continue";
    },
      function (err) { console.error("Error loading GAPI client for API", err); });
}

function displayConvertButton() {
  instructions.innerHTML = '<button id="convert-button" class="pressable" onclick="convert()">Convert Playlist</button>';
}

async function convert() {
  $("#popup").show();
  let popup = document.querySelector("#popup");
  console.log(typeof tracks);
  for(let i=0;i<tracks.length;i++) {
    let track = tracks[i];
    let ytquery = track.name + " ";
    track.artists.forEach(function (artist) {
      ytquery += `${artist.name} `;
    });
    await searchAdd(ytquery, selectedYTPlaylist).then(function(response) {console.log(response)});//this function is in gapi.js
  }
  popup.innerHTML = "<h3>Playlist has been converted</h3>";
  popup.innerHTML += `<a id = "playlist-link" target="_blank" href = "https://www.youtube.com/playlist?list=${selectedYTPlaylist}">Link to playlist</a><br>`;
  popup.innerHTML += `<button id="convert-another" class="pressable" onclick="resetSelection()">Convert another</button>`;
}

function resetSelection() {
  $('#popup').hide();
  document.getElementById(selectedYTPlaylist).style.backgroundColor = "transparent";
  selectedYTPlaylist = null;
  let selectedButton = document.getElementById(selectedSpotifyPlaylist);
  selectedButton.style.backgroundColor = "transparent";
  selectedButton.style.color = "#FFFFFF";
  selectedSpotifyPlaylist = null;
  instructions.innerHTML = "Select playlists to continue";
}

async function testInserting() {
  console.log("test inserting");
  let ids = ["1V9XbBNlCqo", "e2Z0sON2UPc", "sVzvRsl4rEM"];//short change hero, no rest for the wicked, and how you like me know
  let playlistId = "PLfG8ug7yiD7umoxotcYbxpwE4BXJSGKgc";
  let promises = [];
  for(let i=0;i<ids.length;i++) {
    console.log('loop iteration starting');
    await gapi.client.youtube.playlistItems.insert({
      "part": [
        "snippet"
      ],
      "resource": {
        "snippet": {
          "playlistId": playlistId,
          "resourceId": {
            "kind": "youtube#video",
            "videoId": ids[i]
          }
        }
      }
    }).then(function(res){console.log(res)});
  }
  ids.forEach(function (id) {
    console.log(`running for ${id}`);
    promises.push(gapi.client.youtube.playlistItems.insert({
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
    }));
  });
  //Promise.all(promises).then(function(values) {console.log(values)});
}
$('#youtube-login').hide();
      $('#youtube-loggedin').show();
