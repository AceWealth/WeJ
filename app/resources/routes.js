//spotify api decleration
var SpotifyWebApi = require('spotify-web-api-node');
var schedule = require('node-schedule');

//event emitter
var events = require('events');
var myEmitter = new events.EventEmitter();

//variable to store messages
var msgs = [];

//variables for song queues
var playing = false;
var queue = [];
var played = [];

//should be able to use stacks to control the current song queue

//updates the currentsong variable and removes it from the queue list
var updatePlaying = function() {
	if(currentSong == null){
		currentSong = queue[0];
		setTimeout(updatePlaying(), queue[0].time);
	} else {
		played.push(currentSong);
		queue.shift();
		if(queue.length === 0){
			currentSong = null;
		} else {
			currentSong = queue[0];
			setTimeout(updatePlaying(), queue[0].time);
		}
	}


}
myEmitter.on('addSong', function(song) {
	console.log('evented song added ' + song.name);
	if(!playing) {
		myEmitter.emit('playSong', song);
	}

})

myEmitter.on('playNextSong', function() {
	console.log('Playing next song...');
	myEmitter.emit('playSong', msgs[0]);
});

myEmitter.on('playSong', function(song) {
	console.log('Playing song, will update when over');
	console.log(song);

	var songOver = new Date();
	songOver.setMilliseconds(songOver.getMilliseconds() + song.time);

	var j = schedule.scheduleJob(songOver, function(){
		msgs.shift();
		console.log('Song is now over!');
		myEmitter.emit('playNextSong');
	});

});

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
		var trackId = msg.uri.split(':')[2];
	  	spotifyApi.getTrack(trackId)
	  	.then(function(data){
	  		//add the song to the msgs variable for display on the front-end
			  console.log(data);
			var newSong = {
	    	name: msg.name,
	    	artist: msg.artist,
	    	image: msg.image,
	    	uri: msg.uri,
	    	time: data.body.duration_ms,
	    	score: 0,
	    	};
	  		msgs.push(newSong);

		  	myEmitter.emit('addSong', newSong);

	  	}, function(err){
			console.log('errored at add song');
	  		console.log(err);
			console.log(data);
	  	});
	    
	    console.log('Added song ' + msg.name);

	    //disabled for development
	    spotifyApi.addTracksToPlaylist(tokens.getuId(), tokens.getpId(), [msg.uri, ""])
	    .then(function(data) {
            console.log('Added song to playlist');
          }, function(err) {
          	console.log('User id: ' + tokens.getuId());
          	console.log('Playlist id: ' + tokens.getpId());
            console.log(err);

            //try to get the new access token
            tokens.refresh(function() {
            	//refreshes access token and sets the API to that token
            	spotifyApi.setAccessToken(tokens.getAccess());
            	spotifyApi.addTracksToPlaylist(tokens.getuId(), tokens.getpId(), [msg.uri, ""])
			    .then(function(data) {
		            console.log('Added song to playlist');
		          }, function(err) {
		          	console.log('Still did not work');
		            console.log(err);
		        });
            });
            
        });

	    io.emit('song add', msg);
	  });



	  socket.on('vote', function(vote) {
	  	var index = msgs.map(function(element) { return element.name }).indexOf(vote.name);
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
	  		spotifyApi.reorderTracksInPlaylist(tokens.getuId(), tokens.getpId(), index, newindex)
			  .then(function(data) {
			    console.log('Tracks reordered in playlist!');
			  }, function(err) {
			    console.log('Something went wrong!', err);

			    //request new access token
			    tokens.refresh(function() {
			    	//refreshes access token and sets the API to that token
			    	spotifyApi.setAccessToken(tokens.getAccess());
			    	spotifyApi.reorderTracksInPlaylist(tokens.getuId(), tokens.getpId(), index, newindex)
				  .then(function(data) {
				    console.log('Tracks reordered in playlist!');
				  }, function(err) {
				    console.log('Still did not work', err);
				  });
			    });
			  });

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

	  myEmitter.on('playSong', function(song) {
		  io.emit('song play', song);
	  })

	});//end socket

};