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
//var playlistId = '5LlGzhzxGrjoG3YR2KWBmd';

module.exports = function(app, io, tokens) {

	var spotifyApi = new SpotifyWebApi({
	  clientId : tokens.getcId,
	  clientSecret : tokens.getcSec,
	  redirectUri : tokens.getRed
	});

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/index.html');
	});

	app.get('/passed', function(req, res) {
		console.log('User login passed, clearing array');
		msgs.length = 0;
		res.redirect('/party');
	});
	

	app.get('/party', function(req, res) {
		spotifyApi.setAccessToken(tokens.getAccess());
		//console.log('Inside routes: ' + tokens.getAccess());
		res.sendFile(__dirname + '/party.html');
	});

	io.on('connection', function(socket) {

	  console.log('user connected ' + socket.id);
	  //send all songs to the new connection
	  socket.emit('join socket', msgs);


	  socket.on('song add', function(msg) {
	    msgs.push({
	    	name: msg.name,
	    	artist: msg.artist,
	    	image: msg.image,
	    	uri: msg.uri,
	    	score: 0
	    });
	    console.log('Added song ' + msg.name);

	    //disabled for development
	    /*spotifyApi.addTracksToPlaylist(tokens.getuId(), tokens.getpId(), [msg.uri, ""])
	    .then(function(data) {
            console.log('Added song to playlist');
          }, function(err) {
          	console.log('User id: ' + tokens.getuId());
          	console.log('Playlist id: ' + tokens.getpId());
            console.log(err);
        });*/

	    io.emit('song add', msg);
	  });



	  socket.on('vote', function(vote) {
	  	index = msgs.map(function(element) { return element.name }).indexOf(vote.name);
	  	oldscore = msgs[index].score;
	  	newscore = oldscore + vote.vote;
	  	msgs[index].score = newscore;

	  	console.log('New score of ' + msgs[index].name + ' is ' + msgs[index].score);
	  	msg = {
	  		uri: vote.uri,
	  		score: msgs[index].score
	  	};

	  		newindex = index;
	  		switching = false;

	  	console.log('Entering loop, preconditions: Score ' + newscore + ' index ' + index);
	  	for(i = 0; i < msgs.length; i++){
	  		console.log('Song ' + msgs[i].name + ' index ' + i + ' score ' + msgs[i].score );
	  		if(i < index && msgs[i].score < newscore){
	  			switching = true;
	  			newindex = i;
	  			console.log('Song order change detected');
	  			break;
	  		}
	  	}

	  	if(switching){
	  		console.log('Switching songs around');

	  		//disabled for development
	  		/*spotifyApi.reorderTracksInPlaylist(tokens.getuId(), tokens.getpId(), index, newindex)
			  .then(function(data) {
			    console.log('Tracks reordered in playlist!');
			  }, function(err) {
			    console.log('Something went wrong!', err);
			  });*/

			  msgs.splice(newindex, 0, msgs.splice(index, 1)[0]);

			  for(i = 0; i < msgs.length; i++){
			  		console.log('Current song ' + msgs[i].name);
			  	}

			  io.emit('join socket', msgs);

	  	} else {
	  		//send vote
	  		io.emit('vote', msg);
	  	}

	  });

	});//end socket

};