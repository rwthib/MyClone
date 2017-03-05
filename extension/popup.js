function newTab(e) {
	chrome.tabs.create({});
	console.log("New tab created")
}

function refreshing(e) {
	chrome.tabs.reload()
	console.log("Refreshed")
}

function removeTab(e) {
	chrome.tabs.getSelected(null, function(tab){
    	chrome.tabs.remove(tab.id)
    	console.log("The current tab was removed")
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


function openFacebook() {
	chrome.tabs.getSelected(null, function(tab){
    		chrome.tabs.update(tab.id, {url: "https://www.facebook.com/"})
    		console.log("Facebook opened")
	});
}

function openYoutube() {
	chrome.tabs.getSelected(null, function(tab){
    		chrome.tabs.update(tab.id, {url: "https://www.youtube.com/"})
    		console.log("Youtube opened")
	});
}

function openTwitter(e){
	chrome.tabs.getSelected(null, function(tab){
    	chrome.tabs.update(tab.id, {url: "https://twitter.com/"})
    	console.log("Twitter opened")
	});
}

function openNewspaper(e){
	chrome.tabs.getSelected(null, function(tab){
    	chrome.tabs.update(tab.id, {url: "https://www.theguardian.com/"})
    	console.log("Newspaper opened")
	});
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("cmd_newtab").addEventListener('click', newTab);
	document.getElementById("cmd_refresh").addEventListener('click', refreshing);
	document.getElementById("cmd_removetab").addEventListener('click', removeTab);
	document.getElementById("cmd_goBack").addEventListener('click', goBack);
	document.getElementById("cmd_facebook").addEventListener('click', openFacebook);
	document.getElementById("cmd_youtube").addEventListener('click', openYoutube);
	document.getElementById("cmd_twitter").addEventListener('click', openTwitter);
	document.getElementById("cmd_newspaper").addEventListener('click', openNewspaper);

});
