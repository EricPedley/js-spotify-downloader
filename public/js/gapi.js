console.log("gapi code ran");

var youtubeScreen = document.querySelector("#youtube-loggedin");
var selectedYTPlaylist;
var params = getHashParams();

if (params.yt_initialized) {
  listYTPlaylists();
  instructions.innerHTML = "Select playlists to continue";
}

function listYTPlaylists() {
  let req = new XMLHttpRequest;
  req.open("GET", window.location.href.substring(0,window.location.href.indexOf("#")) + "youtube-list-playlists");
  req.onreadystatechange = function () {
    if (req.readyState == XMLHttpRequest.DONE) {
      console.log(JSON.parse(req.responseText));
      let res = JSON.parse(req.responseText);
      $('#youtube-login').hide();
      $('#youtube-loggedin').show();
      youtubeScreen.innerHTML = `<h3 class = "loggedin-message">Logged in to Youtube as ${res.items[0].snippet.channelTitle}</h3>`;
      youtubeScreen.innerHTML += `<a id="youtube-logout" href = "${window.location.href}" onclick = "window.location.reload()" class= "small-link">Log Out</a><br>`;
      res.items.forEach(function (playlist) {
        youtubeScreen.innerHTML += `<button id = '${playlist.id}' class = "pressable playlist-button" onclick = "selectYTPlaylist('${playlist.id}');">${playlist.snippet.title}</button><br>`
      });
    } else {
      if ((req.responseText).includes("quota")) {
        $("#popup").show();
        let popup = document.querySelector("#popup");
        showQuotaMessage(popup);
      }
    }
  }
  req.send();
}


function searchAdd(searchTerm, playlistId) {//searches for a song and adds it to the playlist
  console.log(`SearchAdd being run`);
  let req = new XMLHttpRequest;
  req.open("GET", window.location.href.substring(0,window.location.href.indexOf("#")) + "youtube-search-and-add"+`?term=${serachTerm}&id=${playlistId}`);
  req.onreadystatechange = function() {
    if(req.readyState==XMLHttpRequest.DONE) {
      
    }
  }
  req.send();
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

function displayConvertButton() {
  instructions.innerHTML = '<button id="convert-button" class="pressable" onclick="convert()">Convert Playlist</button>';
}

async function convert() {
  $("#popup").show();
  let popup = document.querySelector("#popup");
  popup.innerHTML = "<h3>Tracks Added:</h3>";
  console.log(tracks);
  for (let i = 0; i < tracks.length; i++) {
    let track = tracks[i].track;
    let ytquery = track.name + " ";
    track.artists.forEach(function (artist) {
      ytquery += `${artist.name} `;
    });
    //popup.innerHTML+=`${ytquery}<br>`
    await searchAdd(ytquery, selectedYTPlaylist)
      .then(function (response) {
        console.log(response);
        popup.innerHTML += `${response.result.snippet.title}<br>`
      }).catch(function (error) {
        if (error.result.error.message.includes("quota")) {
          showQuotaMessage(popup);
        }
        console.log(error.result.error.message);
      });//this function is in gapi.js
  }
  //popup.innerHTML = "<h3>Playlist Conversion Finished</h3>";
  popup.innerHTML += `<a id = "playlist-link" target="_blank" href = "https://www.youtube.com/playlist?list=${selectedYTPlaylist}">Link to playlist</a><br>`;
  popup.innerHTML += `<button class="pressable popup-dismiss" onclick="resetSelection('Select playlists to continue')">Convert another</button>`;
}

function resetSelection(message) {
  $('#popup').hide();
  if (selectedYTPlaylist) {
    document.getElementById(selectedYTPlaylist).style.backgroundColor = "transparent";
    selectedYTPlaylist = null;
  }
  if (selectedSpotifyPlaylist) {
    let selectedButton = document.getElementById(selectedSpotifyPlaylist);
    selectedButton.style.backgroundColor = "transparent";
    selectedButton.style.color = "#FFFFFF";
    selectedSpotifyPlaylist = null;
  }
  instructions.innerHTML = message;
}

function showQuotaMessage(popup) {
  popup.innerHTML += "<h5>Youtube data quota exceeded, try again tomorrow</h5>";
  popup.innerHTML += `<a style="color:#121212" href="#info" class="pressable popup-dismiss" onclick="resetSelection('Try again tomorrow')">What?</a>`;

} 