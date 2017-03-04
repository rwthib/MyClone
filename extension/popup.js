function newTab(e) {
	chrome.tabs.create({});
	//console.log("New tab created!");
}

function refreshing(e) {
	chrome.tabs.reload();
	//console.log("Refreshed");
}

function goingUp() {
	chrome.tabs.executeScript ({code:"document.body.scrollTop += 1000;"});
}

function removeTab(e) {
	chrome.tabs.getSelected(null, function(tab){
    	chrome.tabs.remove(tab.id)
    	//console.log("The current tab was removed")
	});
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("cmd_newtab").addEventListener('click', newTab);
	document.getElementById("cmd_refresh").addEventListener('click', refreshing);
	//document.getElementById("cmd_goBack").addEventListener('click', backInTime);
	document.getElementById("cmd_scrollUp").addEventListener('click', goingUp);
	document.getElementById("cmd_removetab").addEventListener('click', removeTab);
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab
}); 
