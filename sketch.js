var team, name, role, info, poison = 0, antidote = 0, dead = false, started = false, done = false, spySwap = false, nameDisp = 0, infoDisp = true, first = false;

var players = [];
var nameGrid = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {

	if(!started) {
		background(255);
		fill(0);
        noStroke();
		textAlign(CENTER);
		textSize(24);
		text("Welcome To Poison Party", windowWidth/2, windowHeight/10);
		textSize(14);
		text("You will be given a vial of poison, a team, and a role. Your job is to keep your team alive and to poison the opposing team. However, you don't know who's on who's team; you'll have to figure that out through friendly conversation (or looking over their shoulder). Make sure that you're not poisoning someone that somebody else has already poisoned; that'd be an awful waste. If you're a Doctor, you can give someone else antidote. They'll be saved if they were previously poisoned, but otherwise, it won't do anything. If you're a Spy, you can change the color you appear as by tapping your name. Use this to blend in to a team and avoid being found out, but don't be killed by your own team! The game lasts for 8 minutes, more or less. We'll warn you when time's almost up; make sure to do what you have to before the end.", 20, 80, windowWidth-40, windowHeight-80);
        if(first){
            rect(0, windowHeight-80, windowWidth, 80);
            fill(255);
            text("Everyone's In", windowWidth/2, windowHeight-30);
        }
	}
    else if(!done) {
        if(nameDisp == 0){
        if(team == "red" || (team == "blue" && spySwap)){
            fill(255, 200, 200);
        }
        if(team == "blue" || (team == "red" && spySwap)){
            fill(200, 200, 255);
        }
        rect(0, 0, windowWidth, 100);
        fill(0);
        textSize(40);
        text(name, windowWidth/2, 80);
        fill(0);
        ellipse(windowWidth/4, 400, 100, 100);
        fill(200);
        ellipse(windowWidth*3/4, 400, 100, 100);
        textSize(16);
        text("Poison: "+poison, windowWidth/4, 420);
        fill(0);
        text("Antidote: "+antidote, windowWidth*3/4, 420);
        }
        else {
            for()
        }
    }
}

function startGame(data) {
    name = data.name;
	team = data.team;
	role = data.role;
	info = data.info;
    poison = 1;
    if(role=="doctor"){
        antidote = 1;
    }
	started = true;
}

function getPlayers(data) {
    players.push("Nobody");
	for (x in data){
		players.push(x.name);
	}
}

function getInfo(data) {
    infoDisp = true;
    info = data;
}

function poison(target) {
	if(poison > 0){
		socket.emit('poison', target);
		poison--;
	}
}

function gameOver(data) {
	done = true;
}

function popNames() {
    
    for(var i = 0; i<len(players); i++) {
        if(players[i] != name) {
            nameGrid[nameGrid.push({num: i, name: players[i], display: function(){
                fill((this.num*20)%160);
                rect(0, this.num*50, windowWidth, 50);
                fill(255);
                textSize(30);
                text(this.name, windowWidth/2, 40+this.num*50);
            }})].mouseClicked(targetPlayer(players[i]));
        }
    }
    resizeCanvas(windowWidth, len(nameGrid)*50);
}
            
function targetPlayer(target){
    if(target != "Nobody"){
    if(nameDisp == 1){
        socket.emit('poison', target);
        poison--;
    }
    if(nameDisp == 2){
        socket.emit('antidote', target);
        antidote--;
    }
    }
    nameDisp = 0;
}

function mouseClicked() {
    if(!started){
        if(first){
            if(windowHeight-mouseY < 80) {
                socket.emit('start');
            }
        }
    }
    else{
        if(nameDisp == 0){
            if(dist(mouseX, mouseY, windowWidth/4, 400) <= 50 && poison > 0){
                nameDisp = 1;
                popNames();
            }
            if(dist(mouseX, mouseY, windowWidth*3/4, 400) <= 50 && antidote > 0){
                nameDisp = 2;
                popNames();
            }
            if(windowHeight-mouseY < 100) {
                infoDisp = false;
            }
        }
    }
}
