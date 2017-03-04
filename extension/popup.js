function newTab(e) {
	chrome.tabs.create({});
	console.log("New tab created!")
}

function refreshing(e) {
	chrome.tabs.reload()
	console.log("Refresh")
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("cmd_newtab").addEventListener('click', newTab);
	document.getElementById("cmd_refresh").addEventListener('click', refreshing);
});

