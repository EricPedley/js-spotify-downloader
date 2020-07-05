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
      console.log(req.responseText);
      $('#youtube-login').hide();
      $('#youtube-loggedin').show();
      if(req.responseText=="quotaExceeded"){
        showQuotaMessage();
        return;
      }
      let res = JSON.parse(req.responseText);
      youtubeScreen.innerHTML = `<h3 class = "loggedin-message">Logged in to Youtube as ${res.items[0].snippet.channelTitle}</h3>`;
      youtubeScreen.innerHTML += `<a id="youtube-logout" href = "${window.location.href}" onclick = "window.location.reload()" class= "logout-button youtube-colors small-link">Log Out</a><br>`;
      res.items.forEach(function (playlist) {
        youtubeScreen.innerHTML += `<button id = '${playlist.id}' class = "pressable playlist-button" onclick = "selectYTPlaylist('${playlist.id}');">${playlist.snippet.title}</button><br>`
      });
    } else {
      if ((req.responseText).includes("quota")) {
        $("#popup").show();
        showQuotaMessage();
      }
    }
  }
  req.send();
}


function searchAdd(searchTerm, playlistId) {//searches for a song and adds it to the playlist
  console.log(`SearchAdd being run`);
  let popup = document.querySelector("#popup");
  return new Promise(function(resolve,reject) {
    let req = new XMLHttpRequest;
  req.open("GET", window.location.href.substring(0,window.location.href.indexOf("#")) + "youtube-search-and-add"+`?term=${searchTerm}&id=${playlistId}`);
  req.onreadystatechange = function() {
    if(req.readyState==XMLHttpRequest.DONE) {
      console.log(req.responseText);
      if(req.responseText='quotaExceeded'){
        showQuotaMessage();
        return;
      }
      popup.innerHTML+=`${req.responseText}<br>`;
      resolve();
    } else {
      console.log(req.readyState);
    }
  }
  req.send();
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
  while(tracks.length>0) {
    let track = tracks.pop();
    let ytquery = track.name + " ";
    track.artists.forEach(function (artist) {
      ytquery += `${artist.name} `;
    });
    await searchAdd(ytquery, selectedYTPlaylist);
  }
  popup.innerHTML = "<br><h3>Playlist Conversion Finished</h3>";
  popup.innerHTML += `<a id = "playlist-link" class = "small-link" target="_blank" href = "https://www.youtube.com/playlist?list=${selectedYTPlaylist}">Link to playlist</a><br>`;
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

function showQuotaMessage() {
  let popup = document.querySelector("#popup");
  popup.innerHTML += "<h5>Youtube data quota exceeded, try again tomorrow</h5>";
  popup.innerHTML += `Remaining Tracks:<br>${tracks.toString()}`;
  popup.innerHTML += `<a style="color:#121212" href="#info" class="pressable popup-dismiss" onclick="resetSelection('Try again tomorrow')">What?</a>`;

} 