module.exports = {
    listPlaylists: function (req, res) {
        youtube.playlists.list({ part: "snippet", mine: true }).then(function (ytres) {
            res.send(ytres.data);
        }).catch(function (error) { console.error(error) });
    },
    searchAdd: function(req,res) {
        
    }
}