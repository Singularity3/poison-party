var team, role, info, poison, antidote, poisoned, started = false, done = false;

var players = [];

function setup() {

}

function draw() {

}

function startGame(data) {
	team = data.team;
	role = data.role;
	info = data.info;
}

function getPlayers(data) {
	for (x in data){
		players.push(x.name);
	}
}

function poison() {
	
}


//// OTHER JS STUFF CAN GO HERE
// function init(){


// }

// window.addEventListener('load', init);


