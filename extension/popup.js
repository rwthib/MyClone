function newTab(e) {
	chrome.tabs.create({});
	console.log("New tab created!")
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("cmd_newtab").addEventListener('click', newTab);
});