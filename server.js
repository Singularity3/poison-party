// HTTP PORTION

var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	// console.log("The Request is: " + parsedUrl.pathname);
		
	fs.readFile(__dirname + parsedUrl.pathname, 
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			res.writeHead(200);
			res.end(data);
  		}
  	);
  	
}

var playerList = [];
var started = false;

// WEBSOCKET PORTION

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 

	function (socket) {
	
		console.log("We have a new client: " + socket.id);
		///MY SOCKET EVENTS HERE

        socket.on('name', function(data) {
            if(!started){
			playerList.push({
                name: data,
                id: socket.id,
                team: "none",
                role: "none",
                poisoned: 0
            });
            }
		});
        socket.on('start', function() {
            if(len(playerList) >= 8 && !started){
			     startGame();
            }
		});

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);

// FACTION GEN

function generateTeams() {
	var doctors, spies, innos, vips = 0;
	var blue = [];
	var red = [];
	var tempList = playerList;
	var x = len(playerList);
	tempList.sort(function(a, b){return 0.5 - Math.random()});
	for(var i=0; i<x/2, i++) {
		var player = tempList.pop;
		blue.push(playerList.indexOf(player));
		playerList[playerList.indexOf(player)].team = 1;

	}
	while(len(tempList)>0) {
		var player = tempList.pop;
		red.push(playerList.indexOf(player));
		playerList[playerList.indexOf(player)].team = 2;
	}

	doctors = 1+Math.floor(len(blue)/8);
	spies = 1+Math.floor(len(blue)/8);
	//vips = 1+Math.floor(len(blue)/8);
	innos = len(blue)-doctors-spies-vips;
	if(len(blue) > len(red)) {
		innos++;
		doctors--;
	}
	blue.sort(function(a, b){return 0.5 - Math.random()});
	for(x in blue) {
		if(innos > 0){
			playerList[x].role = "inno";
			innos--;
		}
		else if(spies > 0) {
			playerList[x].role = "spy";
			spies--;
		}
		else if(doctors > 0) {
			playerList[x].role = "doctor";
			doctors--;
		}
	}

	doctors = 1+Math.floor(len(red)/8);
	spies = 1+Math.floor(len(red)/8);
	//vips = 1+Math.floor(len(red)/8);
	innos = len(red)-doctors-spies-vips;
	red.sort(function(a, b){return 0.5 - Math.random()});
	for(x in red) {
		if(innos > 0){
			playerList[x].role = "inno";
			innos--;
		}
		else if(spies > 0) {
			playerList[x].role = "spy";
			spies--;
		}
		else if(doctors > 0) {
			playerList[x].role = "doctor";
			doctors--;
		}
	}
}

function startGame() {
	generateTeams();

	for(x in playerList){
		io.broadcast.to(x.id).emit('start', x);
		io.broadcast.to(x.id).emit('players', playerList);
	}
    started = true;
	setTimeout(endGame, 480000);
}

function endGame() {
	io.emit('gameOver', playerList);
}
