// FACTION GEN

function generateTeams() {
	var tempList = playerList;
	var x = len(playerList);
	tempList.sort(function(a, b){return 0.5 - Math.random()});
	for(var i=0; i<x/2, i++) {
		var player = tempList.pop;
		playerList[playerList.indexOf(player)].team = 1;
	}
	while(len(tempList)>0) {
		var player = tempList.pop;
		playerList[playerList.indexOf(player)].team = 2;
	}
	
}
