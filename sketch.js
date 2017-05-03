var team, name, serverid, role, info, sNum, fNum, lNum, poison = 0, order = "none", dead = false, started = false, done = false, spySwap = false, nameDisp = 0, infoDisp = true, first = false, room;
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
		text("You will be given a team and a role. Your job is to keep your team alive and to bring about the downfall the opposing team (and get a tasty meal out of the deal). However, you don't know who's on who's team; you'll have to figure that out through friendly conversation (or looking over shoulders). One person on each team will have a vial of poison to slip into one of the entrees. Try not to order anything flavored with arsenic. There are only so many of each item on the menu, so order as soon as you're confident in your decision! If you're a Spy, you can change the color you appear as by tapping your name. Use this to blend in to a team and avoid being found out, but don't be killed by your own team! The game lasts for 5 minutes, more or less. We'll warn you when time's almost up; make sure to order something before the end, or you'll starve.", 20, 80, windowWidth-40, windowHeight-80);
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
        if(team=="grey"){
            fill(200, 200, 200);
        }
        rect(0, 0, windowWidth, 100);
        fill(0);
        textSize(40);
        text(name, windowWidth/2, 80);
        fill(0);
        ellipse(windowWidth/4, 400, 100, 100);
        fill(200);
        text(poison, windowWidth/4, 400);
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
        }
    }
}

function startGame(data) {
    var pCount = 0;
    for(var i=0; i<data.length; i++){
        if(serverid == data[i].id){
            name = data[i].name;
            team = data[i].team;
            role = data[i].role;
            info = data[i].info;
    if(role == "poisoner"){
        poison = 1;
    }
        }
    if(room == data[i].room){
        pCount++;
    }
    }
    
    sNum = Math.ceil(pCount/3);
    fNum = Math.ceil(pCount/3);
    lNum = Math.ceil(pCount/3);
    
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
    var sP = data[1].steakP;
    var fP = data[1].fishP;
    var lP = data[1].lasP;
    var winner;
    var dead = false;
    var red = 0;
    var blue = 0;
    var count = 0;
    var lone = false;
    
    if(order=="none" || (order=="Steak"&&sP) || (order=="Fish"&&fP) || (order=="Lasagna"&&lP)){
            dead = true;
        }
    for(var i = 0; i<data[0].length; i++) {
        
        if(data[0][i].room == room){
            count++;
            console.log(data[0][i].order);
            if((data[0][i].order == "Steak"&&!sP) || (data[0][i].order == "Fish"&&!fP) || (data[0][i].order == "Lasagna"&&!lP)){
        if("red" == data[0][i].team){
            red++;
        }
        if("blue" == data[0][i].team){
            blue++;
        }
        if("grey" == data[0][i].team){
            lone = true;
        }
        }
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
    var poisonText1, poisonText2;
    if(sP){
        if(fP){
            poisonText1 = "The Steak And Fish";
            poisonText2 = "Were Poisoned";
        }
        else if(lP){
            poisonText1 = "The Steak And Lasagna";
            poisonText2 = "Were Poisoned";
        }
        else{
            poisonText1 = "The Steak Was";
            poisonText2 = "Poisoned Twice";
        }
    }
    else if(fP && !sP){
        if(lP){
            poisonText1 = "The Fish And Lasagna";
            poisonText2 = "Were Poisoned";
        }
        else{
            poisonText1 = "The Fish Was";
            poisonText2 = "Poisoned Twice";
        }
        
    }
    else if(lP && !sP && !fP){
        poisonText1 = "The Lasagna Was";
        poisonText2 = "Poisoned Twice";
    }
    else if(!sP && !fP && !lP){
        poisonText1 = "Nothing Was Poisoned";
        poisonText2 = "Come On, Guys";
    }
    
    if(windowHeight < 600){
        resizeCanvas(windowWidth, 600);
    }
    
    text(poisonText1, windowWidth/2, 60);
    text(poisonText2, windowWidth/2, 120);
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
        text("There is 1 Person", windowWidth/2, 360);
    }
    else {
        text("There are "+red+" People", windowWidth/2, 360);
    }
    text("Alive On Red Team", windowWidth/2, 420);
    if(count%2 == 1){
        if(lone){
            text("The Innocent Lived", windowWidth/2, 480);
        }
        else{
            text("The Innocent Died", windowWidth/2, 480);
        }
    }
    text(winner, windowWidth/2, 570);
    
document.cookie = "id=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}



function warning() {
    infoDisp = true;
    info = "One Minute Remaining";
}

function popNames() {
    
            nameGrid.push({num: 0, name: 'Nothing Yet', display: function(){
                fill(195);
                rect(0, this.num*100, windowWidth, 100);
                fill(50);
                textSize(50);
                text(this.name, windowWidth/2, 75+this.num*100);
            }});

            nameGrid.push({num: 1, name: 'Steak', display: function(){
                fill(215);
                rect(0, this.num*100, windowWidth, 100);
                fill(50);
                textSize(50);
                text(this.name + " - " + sNum, windowWidth/2, 75+this.num*100);
            }});
            nameGrid.push({num: 2, name: 'Fish', display: function(){
                fill(235);
                rect(0, this.num*100, windowWidth, 100);
                fill(50);
                textSize(50);
                text(this.name + " - " + fNum, windowWidth/2, 75+this.num*100);
            }});
    
            nameGrid.push({num: 3, name: 'Lasagna', display: function(){
                fill(255);
                rect(0, this.num*100, windowWidth, 100);
                fill(50);
                textSize(50);
                text(this.name + " - " + lNum, windowWidth/2, 75+this.num*100);
            }});
    resizeCanvas(windowWidth, nameGrid.length*100);
}
            
function targetFood(target){
    if(target != "Nothing Yet"){
    if(nameDisp == 1){
        socket.emit('poison', target);
        poison--;
    }
    if(nameDisp == 2){
        socket.emit('order', target);
        order = target;
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
            if(mouseY/100 <= nameGrid.length){
                targetFood(nameGrid[floor(mouseY/100)].name);
                return false;
            }
        }
        if(nameDisp == 0){
            if(dist(mouseX, mouseY, windowWidth/4, 400) <= 50 && poison > 0){
                nameDisp = 1;
                popNames();
            }
            if(dist(mouseX, mouseY, windowWidth*3/4, 400) <= 50 && order == "none"){
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
    
    if (id != "") {
        socket.emit("rejoin", id);
    } else {
        while (id == "" || id == null) {
            id = prompt("Please Enter Your (Real) Name", "name");
        }
        while (room == "" || room == null) {
            room = prompt("Please Enter A Room Code", "room");
        }
        setCookie(sid);
        serverid = sid;
        room = room.toUpperCase();
        socket.emit('name', [id, room]);
    }
}

function setFirst(){
    first = true;
}

function outOfStock(){
    order = "none";
    infoDisp = true;
    info = "Sorry, we're out of that item";
}

function orderPlaced(item){
    if(item=="Steak"){
        sNum--;
    }
    if(item=="Fish"){
        fNum--;
    }
    if(item=="Lasagna"){
        lNum--;
    }
}