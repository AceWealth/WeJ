var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tokens = [];

require('./resources/auth.js')(app, tokens);

console.log(tokens.getcId());
require('./resources/routes.js')(app, io, tokens);

http.listen(9999, function() {
	console.log('Server active on port 9999');
});