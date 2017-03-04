chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create();
  console.log('NEW TAB');
});