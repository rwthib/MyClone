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
      case 'load facebook':
          loadPage('https://facebook.com');
          break;
      case 'open youtube':
      case 'load youtube':
          loadPage('https://youtube.com');
          break;
      case 'open google':
      case 'search with google':
      case 'load google':
      case 'google':
          startGoogleVoiceSearch();
          break;
      case 'open hacker news':
      case 'load hacker news':
          loadPage('https://news.ycombinator.com');
          break;
      case 'open twitter':
      case 'load twitter':
          loadPage('https://twitter.com');
          break;
      case 'show news':
          loadPage('https://www.theguardian.com/');
          break;
      case 'scroll up':
          scrollUp();
          break;
      case 'scroll down':
          scrollDown();
          break;
      case 'press enter':
          //TODO
          break;
      case 'refresh':
      case 'refresh page':
      case 'reload page':
          refreshing();
      case 'navigate back':
      case 'go back':
          goBack();
          break;
      case 'navigate forward':
      case 'go forward':
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
      case 'display links':
      case 'highlight links':
      case 'show links':
      case 'display options':
      case 'highlight options':
      case 'show options':
          highlightLinks();
          break;
      case 'search near-by supermarkets':
          loadPage('https://www.google.com/search?q=nearby+supermarkets&oq=nearby+supermarkets');
          break;
      case 'open 1st':
      case 'open 2nd':
      case 'open 2nd link':
      case 'open second link':
          selectLink(1);
          break;
      case 'open 2nd':
      case 'open second':      
      case 'open 2nd link':
      case 'open second link':
          selectLink(2);
          break;
      case 'open 3rd':
      case 'open third':      
      case 'open 3nd link':
      case 'open third link':
          selectLink(3);
          break;
      case 'open 4th':
      case 'open fourth':      
      case 'open 4th link':
      case 'open fourth link':
          selectLink(4);
          break;
      default:
  }
});



function newTab(e) {
  chrome.tabs.create({});
  bkg.console.log("New tab created")
}

function refreshing(e) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
  bkg.console.log("Refreshed")
}

function highlightLinks() {
  // chrome.tabs.getSelected(null, function(tab){
  //   chrome.tabs.remove(tab.id)
  //   console.log("The current tab was removed")
  // });
  // $x("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0].href
  // bkg.console.log(getElementByXpath("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0]);

  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {
      file: 'highlightLinks.js'
    })
  });
  // var i = 1;
  // while(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`)) {
  //   // console.log(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`));
  //   getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`).style.backgroundColor = "yellow";
  //   i++;
  // }

}

function startGoogleVoiceSearch(n) {
  loadPage('https://google.com');
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {
      code: 'myFunc();function myFunc() {console.log(\'polling\');if (document.querySelector(\'[aria-label="Search by voice"]\')) {document.querySelector(\'[aria-label="Search by voice"]\').click();console.log(\'found\');} else {;//setTimeout(myFunc, 100);}}'
    })
  });
}


function selectLink(n) {
  // chrome.tabs.getSelected(null, function(tab){
  //   chrome.tabs.remove(tab.id)
  //   console.log("The current tab was removed")
  // });
  // $x("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0].href
  // bkg.console.log(getElementByXpath("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0]);
  bkg.console.log('Opening link ' + n);

  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {
      code: `function getElementByXpath(path) {return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}var link = getElementByXpath('//*[@id=\"rso\"]/div/div/div[${n}]/div/h3/a').href;window.location.href = link`
    }, function(results){ bkg.console.log(results); } )
  });
  // var i = 1;
  // while(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`)) {
  //   // console.log(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`));
  //   getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`).style.backgroundColor = "yellow";
  //   i++;
  // }

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

function scrollDown(e){
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {code: 'document.body.scrollTop+=1000;'})
    // bkg.console.log("Went back")
  });
}

function scrollUp(e){
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {code: 'document.body.scrollTop-=1000;'})
    // bkg.console.log("Went back")
  });
}

// document.addEventListener('DOMContentLoaded', function() {
//   document.getElementById("cmd_newtab").addEventListener('click', newTab);
//   document.getElementById("cmd_refresh").addEventListener('click', refreshing);
//   document.getElementById("cmd_removetab").addEventListener('click', removeTab);
//   document.getElementById("cmd_goBack").addEventListener('click', goBack);
// });
