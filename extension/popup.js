function newTab(e) {
	chrome.tabs.create({});
	//console.log("New tab created!");
}

function refreshing(e) {
<<<<<<< HEAD
	chrome.tabs.reload();
	//console.log("Refreshed");
}

function goingUp() {
	chrome.tabs.executeScript ({code:"document.body.scrollTop += 1000;"});
=======
	chrome.tabs.reload()
	console.log("Refreshed")
>>>>>>> d4f779eef450d4d370bd9eb42e7bf12eb264dae9
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
<<<<<<< HEAD
    	
	});
}


=======
	});
}

>>>>>>> d4f779eef450d4d370bd9eb42e7bf12eb264dae9
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("cmd_newtab").addEventListener('click', newTab);
	document.getElementById("cmd_refresh").addEventListener('click', refreshing);
	document.getElementById("cmd_goBack").addEventListener('click', goBack);
	document.getElementById("cmd_scrollUp").addEventListener('click', goingUp);
	document.getElementById("cmd_removetab").addEventListener('click', removeTab);
	document.getElementById("cmd_goBack").addEventListener('click', goBack);
});
<<<<<<< HEAD


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab
}); 
=======
>>>>>>> d4f779eef450d4d370bd9eb42e7bf12eb264dae9
