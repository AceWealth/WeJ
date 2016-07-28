var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tokens = [];

//set the static route
app.use('/public', express.static(__dirname + '/public'));

require('./resources/auth.js')(app, tokens);

require('./resources/routes.js')(app, io, tokens);

http.listen(8787, function() {
	console.log('Server active on port 8787');
});