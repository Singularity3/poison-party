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
        if(!started){
            socket.emit('setCookie', socket.id);
        }

        socket.on('name', function(data) {
            if(!started&&data != null){
			playerList.push({
                name: data,
                id: socket.id,
                rtid: socket.id,
                team: "none",
                role: "none",
                info: "none",
                poisoned: 0
            });
            }
		});
        socket.on('rejoin', function(data) {
            for(var i=0; i<playerList.length; i++){
                if(data == playerList[i].rtid){
                    playerList[i].id = data;
                }
            }
		});
        socket.on('start', function() {
            if(playerList.length >= 6 && !started){
			     startGame();
            }
		});
    
        socket.on('poison', function(data) {
            console.log(data + " has been poisoned");
            for(var i=0; i<playerList.length; i++){
                if(data == playerList[i].name){
                    playerList[i].poisoned = 1;
                }
            }
		});
    
        socket.on('antidote', function(data) {
            console.log(data + " has been given antidote");
            for(var i=0; i<playerList.length; i++){
                if(data == playerList[i].name){
                    playerList[i].poisoned = 0;
                }
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
	var tempList = [];
    var x = playerList.length;
    for(var i=0; i<x; i++) {
        tempList.push(i);
    }
    console.log(tempList);
	tempList.sort(function(a, b){return 0.5 - Math.random()});
	for(var i=0; i<x/2; i++) {
		var player = tempList.pop();
        console.log(player);
		blue.push(player);
		playerList[player].team = "blue";

	}
	while(tempList.length>0) {
		var player = tempList.pop();
		red.push(player);
		playerList[player].team = "red";
	}

	doctors = 1+Math.floor(blue.length/8);
	spies = 1+Math.floor(blue.length/8);
	//vips = 1+Math.floor(blue.length/8);
	innos = blue.length-doctors-spies-vips;
	if(blue.length > red.length) {
		innos++;
		doctors--;
	}
	blue.sort(function(a, b){return 0.5 - Math.random()});
	for(var i = 0; i<blue.length; i++) {
		if(innos > 0){
			playerList[blue[i]].role = "inno";
            playerList[blue[i]].info = "You are a blue team member. Destroy the red team by any means necessary. Tap this message to make it vanish."
			innos--;
		}
		else if(spies > 0) {
			playerList[blue[i]].role = "spy";
            playerList[blue[i]].info = "You are a blue spy. Destroy the red team by any means necessary. Tap your name to change what color you appear as, to fool your enemies. Tap this message to make it vanish."
			spies--;
		}
		else if(doctors > 0) {
			playerList[blue[i]].role = "doctor";
            playerList[blue[i]].info = "You are a blue doctor. Destroy the red team by any means necessary. Try and save one of your teammates with your antidote. Tap this message to make it vanish."
			doctors--;
		}
	}

	doctors = 1+Math.floor(red.length/8);
	spies = 1+Math.floor(red.length/8);
	//vips = 1+Math.floor(red.length/8);
	innos = red.length-doctors-spies-vips;
	red.sort(function(a, b){return 0.5 - Math.random()});
	for(var i = 0; i<red.length; i++) {
		if(innos > 0){
			playerList[red[i]].role = "inno";
            playerList[red[i]].info = "You are a red team member. Destroy the blue team by any means necessary. Tap this message to make it vanish."
			innos--;
		}
		else if(spies > 0) {
			playerList[red[i]].role = "spy";
            playerList[red[i]].info = "You are a red spy. Destroy the blue team by any means necessary. Tap your name to change what color you appear as, to fool your enemies. Tap this message to make it vanish."
			spies--;
		}
		else if(doctors > 0) {
			playerList[red[i]].role = "doctor";
            playerList[red[i]].info = "You are a red doctor. Destroy the blue team by any means necessary. Try and save one of your teammates with your antidote. Tap this message to make it vanish."
			doctors--;
		}
	}
}

function startGame() {
	generateTeams();

	for(var i = 0; i<playerList.length; i++){
		io.in(playerList[i].id).emit('start', playerList[i]);
		io.in(playerList[i].id).emit('players', playerList);
	}
    started = true;
    setTimeout(generateMessages, 30000)
    setTimeout(warning, 240000);
	setTimeout(endGame, 300000);
}

function warning() {
    io.emit('oneMin');
}

function endGame() {
	io.emit('gameOver', playerList);
    var playerList = [];
}

function generateMessages() {
    
    for(var i = 0; i<playerList.length; i++){
        var rpl = Math.floor(Math.random()*playerList.length);
        var rpl2 = Math.floor(Math.random()*playerList.length);
        while(rpl == i){
            rpl = Math.floor(Math.random()*playerList.length);
        }
        while(rpl2 == i || rpl2 == rpl){
            rpl2 = Math.floor(Math.random()*playerList.length);
        }
        var str1 = "Try having a chat with " + playerList[rpl].name; + " and see if you can get some information.";
        var str2 = "See if you can get a look at " + playerList[rpl].name; + "'s screen and find out what team they are.";
        var str3 = "Hold on to your poison until you can talk to your team members and figure out who they poisoned.";
        var str4 = "Keep a close eye on " + playerList[rpl.name] + "; see if you can find out if they're a spy."
        if(playerList.length > 12){
            if(playerList[rpl].team == playerList[rpl2].team){
                str3 = "I think that " + playerList[rpl].name + " and " + playerList[rpl2].name + " are on the same team; see if you can find out what's going on there."
            }
            else {
                str3 = "I think that " + playerList[rpl].name + " and " + playerList[rpl2].name + " are on different teams; see if you can find out what's going on there."
            }
        }
        var strArray = [str1, str2, str3, str4];
        playerList[i].info = strArray[Math.floor(Math.random*4)];
        io.in(playerList[i].id).emit('info', playerList[i].info);
    }
}
