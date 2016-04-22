var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tokens = [];

require('./resources/auth.js')(app, tokens);

console.log(tokens.getcId());
require('./resources/routes.js')(app, tokens);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

//variable to store messages
var msgs = [];


io.on('connection', function(socket){

  
  console.log('user connected ' + socket.id);
  socket.emit('join socket', msgs);


  socket.on('chat message', function(msg){
    msgs.push({
    	message: msg
    });

    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });

});

http.listen(9999, function() {
	console.log('Server active on port 9999');
});