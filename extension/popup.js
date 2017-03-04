function newTab(e) {
	chrome.tabs.create({});
	console.log("New tab created")
}

function refreshing(e) {
	chrome.tabs.reload()
	console.log("Refresh")
}

function removeTab(e) {
	chrome.tabs.getSelected(null, function(tab){
    	chrome.tabs.remove(tab.id)
    	console.log("The current tab was removed")
	});
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("cmd_newtab").addEventListener('click', newTab);
	document.getElementById("cmd_refresh").addEventListener('click', refreshing);
	document.getElementById("cmd_removetab").addEventListener('click', removeTab);
});

