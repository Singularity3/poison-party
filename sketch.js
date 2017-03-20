var team, name, role, info, poison, antidote, dead = false, started = false, done = false;

var players = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {

	if(!started) {
		background(255);
		fill(0);
		textAlign(CENTER);
		text("Welcome To Poison Party", windowWidth/2, windowHeight/10);
		text("You will be given a vial of poison, a team, and a role. Your job is to keep your team alive and to poison the opposing team. However, you don't know who's on who's team; you'll have to figure that out through friendly conversation (or looking over their shoulder). Make sure that you're not poisoning someone that somebody else has already poisoned; that'd be an awful waste. If you're a Doctor, you can give someone else antidote. They'll be saved if they were previously poisoned, but otherwise, it won't do anything. If you're a Spy, you can change the color you appear as by tapping your name. Use this to blend in to a team and avoid being found out, but don't be killed by your own team! The game lasts for 8 minutes, more or less. We'll warn you when time's almost up; make sure to do what you have to before the end.", 50, 80, windowWidth-50, windowHeight);
	}

}

function startGame(data) {
	team = data.team;
	role = data.role;
	info = data.info;
	started = true;
}

function getPlayers(data) {
	for (x in data){
		players.push(x.name);
	}
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


//// OTHER JS STUFF CAN GO HERE
// function init(){


// }

// window.addEventListener('load', init);


