//require things
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var SpotifyWebApi = require('spotify-web-api-node');

	var client_id = 'd1033531311a43b38b3cedbd9b363367'; // Your client id
	var client_secret = '*'; // Your client secret, REDACTED FOR SECURITY
<<<<<<< HEAD
	var redirect_uri = 'http://wej.pedelen.com/callback'; // Your redirect uri
=======
	var redirect_uri = 'http://localhost:9999/callback'; // Your redirect uri
>>>>>>> b5ab36a331b0d9ab9b7c6a48ed0eb01f1403e6a9

	var spotifyApi = new SpotifyWebApi({
	  clientId : client_id,
	  clientSecret : client_secret,
	  redirectUri : redirect_uri
	});

	var accessToken = '';
	var refreshToken = '';
	var user_Id = '';
	var playlist_Id = '';

	var generateRandomString = function(length) {
	  var text = '';
	  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	  for (var i = 0; i < length; i++) {
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
	  }
	  return text;
	};

	var stateKey = 'spotify_auth_state';

module.exports = function(app, tokens) {



	app.get('/test', function(req, res) {
		res.send('Test worked!');
	});

	//login to spotify
	app.get('/login', function(req, res) {

	  //var state = generateRandomString(16);
	  //res.cookie(stateKey, state);

	  // your application requests authorization
	  var scope = 'user-read-private user-read-email playlist-modify-public';
	  res.redirect('https://accounts.spotify.com/authorize?' +
	    querystring.stringify({
	      response_type: 'code',
	      client_id: client_id,
	      scope: scope,
	      redirect_uri: redirect_uri,
	      //state: state,
	      show_dialog: true
	    }));
	});

	app.get('/callback', function(req, res) {

	  // your application requests refresh and access tokens
	  // after checking the state parameter

	  var code = req.query.code || null;
	  //var state = req.query.state || null;
	  //var storedState = req.cookies ? req.cookies[stateKey] : null;

	  // if (state === null || state !== storedState) {
	  //   res.redirect('/#' +
	  //     querystring.stringify({
	  //       error: 'state_mismatch'
	  //     }));
	  // } else {
	    //res.clearCookie(stateKey);
	    var authOptions = {
	      url: 'https://accounts.spotify.com/api/token',
	      form: {
	        code: code,
	        redirect_uri: redirect_uri,
	        grant_type: 'authorization_code',
	        client_id: client_id,
	        client_secret: client_secret
	      },
	      json: true
	    };

	    request.post(authOptions, function(error, response, body) {
	      if (!error && response.statusCode === 200) {

	        accessToken = body.access_token;
	        refreshToken = body.refresh_token;

	        spotifyApi.setAccessToken(tokens.getAccess());

	        console.log(body.access_token);
	        var userOptions = {
	          url: 'https://api.spotify.com/v1/me',
	          headers: { 'Authorization': 'Bearer ' + accessToken }
	        };

	        // request the userId
	        request.get(userOptions, function(error, response, body) { 
	        	if(!error){
	        		fixedBody = JSON.parse(body);
	          		user_Id = fixedBody.id;
	          		console.log(user_Id);

      			        spotifyApi.createPlaylist(user_Id, 'WeJ Playlist', {'public' : true})
      			          .then(function(data) {
						    console.log('Created playlist!');
						    playlist_Id = data.body.id;
						  }, function(err) {
						    console.log('Something went wrong!', err);
						  });

	      		} else {
	      			console.log(error);
	      		}

	        });



<<<<<<< HEAD
	        // redirect to passed to clear the array
	        res.redirect('/passed');
=======
	        // redirect to the party
	        res.redirect('/party');
>>>>>>> b5ab36a331b0d9ab9b7c6a48ed0eb01f1403e6a9
	      } else {
	        res.redirect('/#' +
	          querystring.stringify({
	            error: 'invalid_token'
	          }));
	      }
	    });
	  	//}
	});


	//All token declerations
	tokens.getcId = function() {
		return client_id;
	}
	tokens.getcSec = function() {
		return client_secret;
	}
	tokens.getRed = function() {
		return redirect_uri;
	}
	tokens.getAccess = function() {
		return accessToken;
	}
	tokens.getRefresh = function() {
		return refreshToken;
	}
	tokens.getuId = function() {
		return user_Id;
	}
	tokens.getpId = function() {
		return playlist_Id;
	}
	tokens.refresh = function() {
		var authOptions = {
		    url: 'https://accounts.spotify.com/api/token',
		    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
		    form: {
		      grant_type: 'refresh_token',
		      refresh_token: refreshToken
		    },
		    json: true
	  	};

		request.post(authOptions, function(error, response, body) {
			if (!error && response.statusCode === 200) {
			  accessToken = body.access_token;
			}
			if(body.refresh_token){
				refreshToken = body.refresh_token;
			}
		});

		//return the new access token
		return accessToken;

	}
};
