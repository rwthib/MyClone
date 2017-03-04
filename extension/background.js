chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.create({url:chrome.extension.getURL('commands.html')});
   	 console.log("Commands Menu start!");
});
