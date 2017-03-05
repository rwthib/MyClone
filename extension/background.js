// // React when a browser action's icon is clicked.
// chrome.browserAction.onClicked.addListener(function(tab) {
//   var viewTabUrl = chrome.extension.getURL('image.html');
//   var imageUrl = /* an image's URL */;

//   // Look through all the pages in this extension to find one we can use.
//   var views = chrome.extension.getViews();
//   for (var i = 0; i < views.length; i++) {
//     var view = views[i];

//     // If this view has the right URL and hasn't been used yet...
//     if (view.location.href == viewTabUrl && !view.imageAlreadySet) {

//       // ...call one of its functions and set a property.
//       view.setImageUrl(imageUrl);
//       view.imageAlreadySet = true;
//       break; // we're done
//     }
//   }
// });


var bkg = chrome.extension.getBackgroundPage();
var socket = io('https://alexachrome.scalingo.io');
socket.on('connect', function(){
  bkg.console.log('connected');
});
socket.on('action', function (action) {
  bkg.console.log(action);
  /* action can be one of: open facebook, scroll up, scroll down, navigate back, navigate forward, open <site name>, open <url>, search <phrase>*/
  switch(action) {
      case 'open facebook':
          loadPage('https://facebook.com');
          break;
      case 'open youtube':
          loadPage('https://youtube.com');
          break;
      case 'open google':
          loadPage('https://google.com');
          break;
      case 'scroll up':
          //TODD
          break;
      case 'scroll down':
          //TODO
          break;
      case 'press enter':
          //TODO
          break;
      case 'navigate back':
          goBack();
          break;
      case 'navigate forward':
          //TODO
          break;
      case 'press enter':
          //TODO
          break;
      case 'new tab':
          newTab();
          break;
      case 'close tab':
          removeTab();
          break;
      default:
  }
});



function newTab(e) {
  chrome.tabs.create({});
  bkg.console.log("New tab created")
}

function refreshing(e) {
  chrome.tabs.reload()
  bkg.console.log("Refreshed")
}

function selectNthLink(n) {
  // chrome.tabs.getSelected(null, function(tab){
  //   chrome.tabs.remove(tab.id)
  //   console.log("The current tab was removed")
  // });
  // $x("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0].href
  // bkg.console.log(getElementByXpath("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0]);

}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function removeTab(e) {
  chrome.tabs.getSelected(null, function(tab){
      chrome.tabs.remove(tab.id)
      bkg.console.log("The current tab was removed")
  });
}

function loadPage(url) {
  chrome.tabs.getSelected(null, function(tab){
      chrome.tabs.update(tab.id, {url: url})
      bkg.console.log('opening ' + url);
  });
}

function goBack(e){
  var microsecondsADay = 1000 * 60 * 60 * 24;
    var today = (new Date).getTime() - microsecondsADay;
  chrome.history.search({'text': '', 'startTime': today }, function(historyItems){
      var lastUrl = historyItems[1].url;
      chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.update(tab.id, {url: lastUrl})
        bkg.console.log("Went back")
      });
      
  });
  // window.history.go(-1); //TODO: inject via content script
}

// document.addEventListener('DOMContentLoaded', function() {
//   document.getElementById("cmd_newtab").addEventListener('click', newTab);
//   document.getElementById("cmd_refresh").addEventListener('click', refreshing);
//   document.getElementById("cmd_removetab").addEventListener('click', removeTab);
//   document.getElementById("cmd_goBack").addEventListener('click', goBack);
// });
