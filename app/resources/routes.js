	        //var userId = ''; 
	        //var options = {
	        //   url: 'https://api.spotify.com/v1/me',
	        //   headers: { 'Authorization': 'Bearer ' + access_token },
	        //   json: true
	        // };

	        // // use the access token to access the Spotify Web API
	        // request.get(options, function(error, response, body) {
	        //   console.log(body);  
	        //   userId = body.id;
	        //   var playlistId = '5LlGzhzxGrjoG3YR2KWBmd';

	        //   //get a list of playlists
	        //   var playlistReq = {
	        //     url: 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks',
	        //     headers: { 'Authorization': 'Bearer ' + access_token },
	        //     form: {
	        //       uris: ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh']
	        //     },
	        //     json: true
	        //   };
	        //   spotifyApi.addTracksToPlaylist(userId, playlistId, ["spotify:track:5kqIPrATaCc2LqxVWzQGbk", ""])
	        //   .then(function(data) {
	        //     console.log(data);
	        //   }, function(err) {
	        //     console.log(err);
	        //   });
	        // });




//spotify api decleration
var SpotifyWebApi = require('spotify-web-api-node');


//variable to store messages
var msgs = [];

//Playlist id, will not be static later
var playlistId = '5LlGzhzxGrjoG3YR2KWBmd';

module.exports = function(app, io, tokens) {

	var spotifyApi = new SpotifyWebApi({
	  clientId : tokens.getcId,
	  clientSecret : tokens.getcSec,
	  redirectUri : tokens.getRed
	});


	

	app.get('/party', function(req, res) {
		spotifyApi.setAccessToken(tokens.getAccess());
		//console.log('Inside routes: ' + tokens.getAccess());
		res.sendFile(__dirname + '/index.html');
	});

	io.on('connection', function(socket){

	  console.log('user connected ' + socket.id);
	  //send all songs to the new connection
	  socket.emit('join socket', msgs);


	  socket.on('song add', function(msg){
	    msgs.push({
	    	message: msg
	    });

	    //test msg: spotify:track:5kqIPrATaCc2LqxVWzQGbk
	    spotifyApi.addTracksToPlaylist(tokens.getuId(), playlistId, [msg.uri, ""])
	    .then(function(data) {
            console.log(data);
          }, function(err) {
            console.log(err);
        });

	    io.emit('song add', msg);
	  });

	});

};