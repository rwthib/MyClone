chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({url:"www.google.es"});
  console.log('NEW TAB');
});