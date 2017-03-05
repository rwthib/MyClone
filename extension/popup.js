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

function goBack(e){
	var microsecondsADay = 1000 * 60 * 60 * 24;
  	var today = (new Date).getTime() - microsecondsADay;
	chrome.history.search({'text': '', 'startTime': today }, function(historyItems){
    	var lastUrl = historyItems[1].url;
    	chrome.tabs.getSelected(null, function(tab){
    		chrome.tabs.update(tab.id, {url: lastUrl})
    		console.log("Went back")
		});
    	
	});
}


document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("cmd_newtab").addEventListener('click', newTab);
	document.getElementById("cmd_refresh").addEventListener('click', refreshing);
	document.getElementById("cmd_goBack").addEventListener('click', goBack);
	document.getElementById("cmd_scrollUp").addEventListener('click', goingUp);
	document.getElementById("cmd_removetab").addEventListener('click', removeTab);
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab
}); 
