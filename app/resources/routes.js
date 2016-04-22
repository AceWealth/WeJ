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

module.exports = function(app, tokens) {
	console.log('Inside routes: ' + tokens.getcId());

	app.get('/party', function(req, res) {
		res.send('Party worked!');
	});
};