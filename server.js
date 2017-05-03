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
var roomsStarted = [];

// WEBSOCKET PORTION

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 

	function (socket) {
	
		console.log("We have a new client: " + socket.id);
		///MY SOCKET EVENTS HERE
            socket.emit('setCookie', socket.id);
        var room;
    

        socket.on('name', function(data) {
            if(!getRoomStarted(data[1].toUpperCase())){
            if(data != null){
                room = data[1].toUpperCase();
                socket.join(room);
			playerList.push({
                "name": data[0],
                "id": socket.id,
                "rtid": socket.id,
                "room": room,
                "team": "none",
                "role": "none",
                "info": "none",
                "order": "none"
            });
                if(playersInRoom(room).length == 1){
                    socket.emit('first');
                }
            }
            }
            else{
                socket.emit('roomStarted');
            }
		});
        socket.on('rejoin', function(data) {
            var rejSuc = false;
            for(var i=0; i<playerList.length; i++){
                if(data == playerList[i].rtid){
                    playerList[i].id = data;
                    rejSuc = true;
                }
            }
            if(!rejSuc){
                socket.emit('setCookie', socket.id);
            }
		});
        socket.on('start', function() {
            console.log("Attempting to start game");
            if(playersInRoom(room).length >= 2 && !getRoomStarted(room)){
			     startGame(room);
            }
		});
    
        socket.on('poison', function(data) {
            console.log(data + " has been poisoned");
            for(var i=0; i<roomsStarted.length; i++){
                if(room = roomsStarted[i].rn){
                    if(data == "Steak"){
                        roomsStarted[i].steakP = true;
                        return false;
                    }
                    if(data == "Fish"){
                        roomsStarted[i].fishP = true;
                        return false;
                    }
                    if(data == "Lasagna"){
                        roomsStarted[i].lasP = true;
                        return false;
                    }
                }
            }
            
		});
    
        socket.on('order', function(data) {
            for(var i=0; i<roomsStarted.length; i++){
                if(room == roomsStarted[i].rn){
                    if(data == "Steak"){
                        if(roomsStarted[i].steakNum>0){
                            console.log("Steak has been ordered");
                            roomsStarted[i].steakNum--;
                            playerList[getPlayer(socket.id)].order = "Steak";
                            io.in(room).emit('orderPlaced', data);
                            return false;
                        }
                    }
                    if(data == "Fish"){
                        if(roomsStarted[i].fishNum>0){
                            console.log("Fish has been ordered");
                            roomsStarted[i].fishNum--;
                            playerList[getPlayer(socket.id)].order = "Fish";
                            io.in(room).emit('orderPlaced', data);
                            return false;
                        }
                    }
                    if(data == "Lasagna"){
                        if(roomsStarted[i].lasNum>0){
                            console.log("Lasagna has been ordered");
                            roomsStarted[i].lasNum--;
                            playerList[getPlayer(socket.id)].order = "Lasagna";
                            io.in(room).emit('orderPlaced', data);
                            return false;
                        }
                    }
                }
            }
            socket.emit('outOfStock');
		});

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);

// FACTION GEN

function generateTeams(room) {
	var poisoners, spies, innos = 0;
	var blue = [];
	var red = [];
    var lone = -1;
	var tempList = playersInRoom(room);
    var x = tempList.length;
    console.log(tempList);
	tempList.sort(function(a, b){return 0.5 - Math.random()});
	for(var i=0; i<x/2; i++) {
		var player = tempList.pop();
		blue.push(player);
		playerList[player].team = "blue";

	}
	while(tempList.length>0) {
		var player = tempList.pop();
		red.push(player);
		playerList[player].team = "red";
	}
    
    blue.sort(function(a, b){return 0.5 - Math.random()});
    if(blue.length>red.length){
        lone = blue.pop();
    }
	poisoners = 1;
	spies = 1+Math.floor(blue.length/6);
	innos = blue.length-poisoners-spies;
	for(var i = 0; i<blue.length; i++) {
		if(innos > 0){
			playerList[blue[i]].role = "inno";
            playerList[blue[i]].info = "You are a blue team member. Try and find out what's been poisoned, and stay away from it. Tap this message to make it vanish."
			innos--;
		}
        else if(poisoners > 0) {
			playerList[blue[i]].role = "poisoner";
            playerList[blue[i]].info = "You are the blue poisoner. Destroy the red team by any means necessary. Tap this message to make it vanish."
			poisoners--;
		}
		else if(spies > 0) {
			playerList[blue[i]].role = "spy";
            playerList[blue[i]].info = "You are a blue spy. Go undercover, and figure out the other team's plans. Tap your name to change what color you appear as, to fool your enemies. Tap this message to make it vanish."
			spies--;
		}
	}

	poisoners = 1;
	spies = 1+Math.floor(red.length/6);
	innos = red.length-poisoners-spies;
	red.sort(function(a, b){return 0.5 - Math.random()});
	for(var i = 0; i<red.length; i++) {
		if(innos > 0){
			playerList[red[i]].role = "inno";
            playerList[red[i]].info = "You are a red team member. Try and find out what's been poisoned, and stay away from it. Tap this message to make it vanish."
			innos--;
		}
        else if(poisoners > 0) {
			playerList[red[i]].role = "poisoner";
            playerList[red[i]].info = "You are the red poisoner. Destroy the blue team by any means necessary. Tap this message to make it vanish."
			poisoners--;
		}
		else if(spies > 0) {
			playerList[red[i]].role = "spy";
            playerList[red[i]].info = "You are a red spy. Go undercover, and figure out the other team's plans. Tap your name to change what color you appear as, to fool your enemies. Tap this message to make it vanish."
			spies--;
		}
	}
    
    if(lone>=0){
        {
            playerList[lone].team = "grey";
			playerList[lone].role = "inno";
            playerList[lone].info = "You are an innocent guest at this party. You don't belong to any team. Try not to die."
			poisoners--;
		}
    }
    var dishNum = Math.ceil(x/3);
    roomsStarted.push({'rn': room, 'steakNum': dishNum, 'fishNum': dishNum, 'lasNum': dishNum, 'steakP': false, 'fishP': false, 'lasP': false});
}

function startGame(room) {
	generateTeams(room);

		io.in(room).emit('start', playerList);
    
    setTimeout(generateMessages, 45000, room);
    setTimeout(warning, 180000, room);
	setTimeout(endGame, 240000, room);
}

function warning(room) {
    console.log("One Minute Remains");
    io.in(room).emit('oneMin');
}

function endGame(room) {
    console.log("Game Over");
    for(var i=0; i<roomsStarted.length; i++){
        if(roomsStarted[i].rn == room){
            io.in(room).emit('gameOver', [playerList, roomsStarted[i]]);
            return false;
        }
    }
}

/*function cleanup(){
    playerList = [];
    started = false;
}*/



function generateMessages(room) {
    console.log("Sending Info");
    var players = playersInRoom(room);
    var strArray = [4];
    for(var i = 0; i<players.length; i++){
        var rpl = players[Math.floor(Math.random()*players.length)];
        var rpl2 = players[Math.floor(Math.random()*players.length)];
        while(rpl == players[i]){
            rpl = players[Math.floor(Math.random()*players.length)];
        }
        while(rpl2 == players[i] || rpl2 == rpl){
            rpl2 = players[Math.floor(Math.random()*players.length)];
        }
        strArray[0] = "Try having a chat with " + playerList[rpl].name + " and see if you can get some information.";
        strArray[1] = "See if you can get a look at " + playerList[rpl].name + "'s screen and find out what team they are.";
        strArray[2] = "Try and find someone with poison, and keep tabs on them.";
        strArray[3] = "Keep a close eye on " + playerList[rpl].name + "; see if you can find out if they're a spy.";
        if(playerList.length > 12){
            if(playerList[rpl].team == playerList[rpl2].team){
                strArray[2] = "I think that " + playerList[rpl].name + " and " + playerList[rpl2].name + " are on the same team; see if you can find out what's going on there.";
            }
            else {
                strArray[2] = "I think that " + playerList[rpl].name + " and " + playerList[rpl2].name + " are on different teams; see if you can find out what's going on there.";
            }
        }
        var finStr = strArray[Math.floor(Math.random()*4)];
        playerList[players[i]].info = finStr;
        io.in(playerList[players[i]].id).emit('info', playerList[players[i]].info);
    }
}

function playersInRoom(room){
    var players = [];
    for(var i = 0; i<playerList.length; i++){
        if(playerList[i].room == room){
            players.push(i);
        }
    }
    return players;
}

function getRoomStarted(room){
    for(var i = 0; i<roomsStarted.length; i++){
        if(roomsStarted[i].rn == room){
            return true;
        }
    }
    return false;
}

function getPlayer(id){
    for(var i = 0; i<playerList.length; i++){
        if(playerList[i].id == id) {
            return i;
        }
    }
    return -1;
}