var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8080);

var users = [];

function handler(req, res){
	fs.readFile(__dirname + '/index.html',
	function(err, data) {
		if(err) {
			res.writeHead(500);
			return res.end("Error loading index.html");
		}
		res.writeHead(200);
		res.end(data);
	});
}

io.on('connection', function(socket){
	var username;
	socket.emit('connected', {connected: users.length + 1});
	socket.on('connected', function(data){
		username = data.data;
		users.push(username);
		socket.emit('link start', {message:"you are connected",connected: users.length});
	});


	socket.broadcast.emit('new connection', {message:"new user connected", connected:users.length + 1});

	socket.on('disconnect', function(){
		users.splice(users.indexOf(username),1);
		setTimeout(function(){

			socket.broadcast.emit('user disconnect', {message:"disconnected", connected: users.length});
		}, 2000);
	});

});
