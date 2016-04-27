var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tokens = [];

//set the static route
app.use('/public', express.static('public'));

require('./resources/auth.js')(app, tokens);

require('./resources/routes.js')(app, io, tokens);

http.listen(9999, function() {
	console.log('Server active on port 9999');
});