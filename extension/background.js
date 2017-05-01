var bkg = chrome.extension.getBackgroundPage();
var socket = io('https://serene-harbor-37271.herokuapp.com/'); //TODO Replace this with your own server URL
  


chrome.runtime.onMessage.addListener(function(mail, sender, sendResponse) {
  var hash = md5(mail);

  chrome.storage.sync.set({'channel': hash}, function() {
    // Notify that we saved.
    var text = "alert('stored hash for " + mail + ": " + hash + "');";
    // chrome.tabs.executeScript({code: text})

    startSocket(hash);
  });
});

function startExtension() {
  chrome.storage.sync.get("channel", function (data) {
      var channel = data.channel;
      if(channel != undefined && channel.length == 32) {
        bkg.console.log('Channel found: ' + channel);
        startSocket(channel);
      } else {
        bkg.console.log('No correct channel found when starting, channel found: ' + channel);
      }
  });
  // if(!setup) {
  //   text = "alert('No channel set');";
  //   // chrome.tabs.executeScript({code: text});
  //   bkg.console.log(text)
  // }
}
startExtension();


// Only start socket when login with Amazon is completed
function startSocket(channel) {
  // var text = "alert('Starting socket for channel " + channel + "');";
  // chrome.tabs.executeScript({code: text})
  bkg.console.log('Starting socket for channel: ' + channel);


  socket.on('connect', function(){
    bkg.console.log('connected');
  });
  socket.on(channel, function (action) {
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
        case 'press spacebar':
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
            goFoward();
            break;
        case 'open tab':
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
        case 'deselect links':
        case 'restore links':
        case 'deselect':
        case 'undo':
        case 'restore':
        case 'remove highlights':
        case 'remove highlighting':
            deselectLinks();
            break;
        case 'search near-by supermarkets':
            loadPage('https://www.google.com/search?q=nearby+supermarkets&oq=nearby+supermarkets');
            break;
        case 'open 1st':
        case 'open 2nd':
        case 'open 2nd link':
        case 'open second link':
            openLink(1);
            break;
        case 'open 2nd':
        case 'open second':      
        case 'open 2nd link':
        case 'open second link':
            openLink(2);
            break;
        case 'open 3rd':
        case 'open third':      
        case 'open 3nd link':
        case 'open third link':
            openLink(3);
            break;
        case 'open 4th':
        case 'open fourth':      
        case 'open 4th link':
        case 'open fourth link':
            openLink(4);
            break;
        default:
            if(action.includes('select link')) {
              const linkNumber = action.substring(12);
              openLink(linkNumber);
            }
    }
  });
}


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

function deselectLinks() {
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {
      code: "var stylesheets = document.styleSheets;for(var i = 0; i < stylesheets.length; i++) {if(stylesheets[i].title == 'highlights') {stylesheets[i].disabled=true;}}"
    })
  });
}

//TODO: unUpdated fires not once but on every tab update
function startGoogleVoiceSearch(n) {
  bkg.console.log('searching with google');
  loadPage('https://google.com');
  chrome.tabs.getSelected(null, function(tab){
    // chrome.tabs.onUpdated.addListener(function(tab, info) {
    //     if (info.status == "complete") {
    //         bkg.console.log('ready');
    //         chrome.tabs.executeScript(tab.id, {
    //           code: 'console.log(\'voiceSearch script injected\');myFunc();function myFunc() {console.log(\'polling\');if (document.querySelector(\'[aria-label="Search by voice"]\')) {document.querySelector(\'[aria-label="Search by voice"]\').click();console.log(\'found\');} else {;setTimeout(myFunc, 100);}}' 
    //         }) 
    //     }
    // });
    setTimeout(()=>{
      chrome.tabs.executeScript(tab.id, {
        code: 'console.log(\'voiceSearch script injected\');myFunc();function myFunc() {console.log(\'polling\');if (document.querySelector(\'[aria-label="Search by voice"]\')) {setTimeout(()=>{document.querySelector(\'[aria-label="Search by voice"]\').click();},1000);console.log(\'found:\');console.log(document.querySelector(\'[aria-label="Search by voice"]\'));} else {;setTimeout(myFunc, 100);}}' 
      }) 
    }, 1000);
  });
}


function openLink(n) {
  // chrome.tabs.getSelected(null, function(tab){
  //   chrome.tabs.remove(tab.id)
  //   console.log("The current tab was removed")
  // });
  // $x("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0].href
  // bkg.console.log(getElementByXpath("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0]);
  bkg.console.log('Opening link ' + n);

  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {
      code: `var link = document.querySelector('[data-index="${n}"]'); console.log(link);window.location.href = link`
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
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {code: 'window.history.go(-1);'})
    bkg.console.log("Went back")
  });
}

function goFoward(e){
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {code: 'window.history.go(1);'})
    bkg.console.log("Went back")
  });
}

function scrollDown(e){
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {code: 'document.body.scrollTop+=1000;'})
    bkg.console.log("Scrolling down")
  });
}

function scrollUp(e){
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {code: 'document.body.scrollTop-=1000;'})
    bkg.console.log("Scrolling up")
  });
}

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    chrome.tabs.create({url: "https://serene-harbor-37271.herokuapp.com/login"}, function (tab) {
        console.log("Prompted user to login with Amazon");
    });
    if(details.reason == "install"){
        console.log("This is a first install!");
        // chrome.tabs.create({url: "https://serene-harbor-37271.herokuapp.com/login"}, function (tab) {
        //     console.log("Prompted user to login with Amazon");
        // });
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});



