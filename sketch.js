var team, name, role, info, poison = 0, antidote = 0, dead = false, started = false, done = false, spySwap = false, nameDisp = 0, infoDisp = true, first = false;
var players = [];
var nameGrid = [];


function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	if(!started) {
        background('rgba(255,255,255, 0.25)');
		
		fill(0);
        noStroke();
		textAlign(CENTER);
		textSize(24);
		text("Welcome To Poison Party", windowWidth/2, 60);
		textSize(14);
		text("You will be given a vial of poison, a team, and a role. Your job is to keep your team alive and to poison the opposing team. However, you don't know who's on who's team; you'll have to figure that out through friendly conversation (or looking over their shoulder). Make sure that you're not poisoning someone that somebody else has already poisoned; that'd be an awful waste. If you're a Doctor, you can give someone else antidote. They'll be saved if they were previously poisoned, but otherwise, it won't do anything. If you're a Spy, you can change the color you appear as by tapping your name. Use this to blend in to a team and avoid being found out, but don't be killed by your own team! The game lasts for 5 minutes, more or less. We'll warn you when time's almost up; make sure to do what you have to before the end.", 20, 80, windowWidth-40, windowHeight-80);
        if(first){
            rect(0, windowHeight-80, windowWidth, 80);
            fill(255);
            text("Everyone's In", windowWidth/2, windowHeight-30);
        }
	}
    else if(!done) {
        background('rgba(255,255,255, 0.25)');
        if(nameDisp == 0){
        if((team == "red" && !spySwap) || (team == "blue" && spySwap)){
            fill(255, 200, 200);
        }
        if((team == "blue" && !spySwap) || (team == "red" && spySwap)){
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
        text("Poison", windowWidth/4, 420);
        fill(0);
        text("Order", windowWidth*3/4, 420);
        if(infoDisp){
            fill(200);
            rect(0, windowHeight-100, windowWidth, 100);
            fill(0);
            text(info, 20, windowHeight-90, windowWidth-40, 80)
        }
        }
        else {
            for(var i = 0; i<nameGrid.length; i++){
                nameGrid[i].display();
            }
            textSize(14);
            fill(0);
            text("Scroll Here", (windowWidth*2/3)+5, 80, (windowWidth/3)-5, windowHeight-80)
        }
    }
}

function startGame(data) {
    name = data.name;
	team = data.team;
	role = data.role;
	info = data.info;
    if(role = "Poisoner"){
        poison = 1;
    }
	started = true;
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
    background(0);
    fill(255);
    var winner;
    var dead;
    var red = 0;
    var blue = 0;
    
    for(var i = 0; i<data.length; i++) {
        if(name == data[i].name){
            dead = data[i].poisoned;
        }
        if("red" == data[i].team && data[i].poisoned == 0){
            red++;
        }
        if("blue" == data[i].team && data[i].poisoned == 0){
            blue++;
        }
    }
    if(red>blue){
        winner = "Red Team Wins";
    }
    else if(red<blue){
        winner = "Blue Team Wins";
    }
    else{
        winner = "Tie Game";
    }
    
    textSize(30);
    text("Game Over", windowWidth/2, 60);
    text(winner, windowWidth/2, 120);
    if(dead == 1){
        text("You Are Dead", windowWidth/2, 180);
    }
    else{
        text("You Are Alive", windowWidth/2, 180);
    }
    if(blue==1){
        text("There is 1 Person", windowWidth/2, 240);
    }
    else {
        text("There are "+blue+" People", windowWidth/2, 240);
    }
    text("Alive On Blue Team", windowWidth/2, 300);
    if(red==1){
        text("There is 1 Person", windowWidth/2, 400);
    }
    else {
        text("There are "+red+" People", windowWidth/2, 400);
    }
    text("Alive On Red Team", windowWidth/2, 460);
    
document.cookie = "id=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}



function warning() {
    infoDisp = true;
    info = "One Minute Remaining";
}

function popNames() {
    
            nameGrid.push({num: 0, name: 'Nothing Yet', display: function(){
                fill((this.num*20)%160);
                rect(0, this.num*40, windowWidth*2/3, 40);
                fill(255);
                textSize(25);
                text(this.name, windowWidth/3, 35+this.num*40);
            }});

            nameGrid.push({num: 0, name: 'Steak', display: function(){
                fill((this.num*20)%160);
                rect(0, this.num*40, windowWidth*2/3, 40);
                fill(255);
                textSize(25);
                text(this.name, windowWidth/3, 35+this.num*40);
            }});
            nameGrid.push({num: 1, name: 'Fish', display: function(){
                fill((this.num*20)%160);
                rect(0, this.num*40, windowWidth*2/3, 40);
                fill(255);
                textSize(25);
                text(this.name, windowWidth/3, 35+this.num*40);
            }});
    
            nameGrid.push({num: 0, name: 'Lasagna', display: function(){
                fill((this.num*20)%160);
                rect(0, this.num*40, windowWidth*2/3, 40);
                fill(255);
                textSize(25);
                text(this.name, windowWidth/3, 35+this.num*40);
            }});
    resizeCanvas(windowWidth, nameGrid.length*50);
}
            
function targetFood(target){
    if(target != "Nothing Yet"){
    if(nameDisp == 1 ){
        socket.emit('poison', target);
        poison--;
    }
    if(nameDisp == 2){
        socket.emit('order', target);
        antidote--;
    }
    }
    nameDisp = 0;
    nameGrid = [];
    resizeCanvas(windowWidth, windowHeight);
}

/*function mouseClicked() {
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
        else{
            if(mouseY/50 <= nameGrid.length){
                targetPlayer(nameGrid[floor(mouseY/50)].name);
            }
        }
    }
    return false;
}*/


function mousePressed() {
    if(!started){
        if(first){
            if(windowHeight-mouseY < 80) {
                socket.emit('start');
            }
        }
    }
    else{
        if(nameDisp!=0){
            if(mouseY/50 <= nameGrid.length && mouseX < windowWidth*2/3){
                targetFood(nameGrid[floor(mouseY/50)].name);
                return false;
            }
        }
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
            if(mouseY < 100 && role == "spy") {
                spySwap = !spySwap;
            }
        }
    }
}


function setCookie(id) {
    var d = new Date();
    d.setTime(d.getTime() + (15*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie =  "id=" + id + ";" + expires + ";path=/";
}

function getCookie() {
    var name = "id=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(sid) {
    var id = getCookie();
    var room;
    if (id != "") {
        socket.emit("rejoin", id);
    } else {
        while (id == "" || id == null) {
            id = prompt("Please Enter Your (Real) Name", "name");
        }
            room = prompt("Please Enter A Room Code", "room");
        setCookie(sid);
        socket.emit('name', [id, room]);
    }
}

function setFirst(){
    first = true;
}