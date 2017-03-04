function newTab(e) {
	chrome.tabs.create({});
	console.log("New tab created!");
}

function refreshing(e) {
	chrome.tabs.reload();
	console.log("Refreshed");
}

function goingUp(e) {
	/*window.setTimeout(function() {
		window.scrollTo(0,0);
	}, 0);*/
	var x, y;
	x = 0;  //horizontal coord
	y = document.height; //vertical coord
	window.scroll(x,y);
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("cmd_newtab").addEventListener('click', newTab);
	document.getElementById("cmd_refresh").addEventListener('click', refreshing);
	document.getElementById("cmd_goBack").addEventListener('click', backInTime);
	document.getElementById("cmd_scrollUp").addEventListener('click', goingUp);
});

