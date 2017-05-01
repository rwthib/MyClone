// Runs only when login page opened

var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
  	alert('2')
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
    alert('3')
    port.postMessage(event.data.text);
  }
}, false);



// chrome.runtime.onMessageExternal.addListener(
//   function(request, sender, sendResponse) {
//   	console.log('second')
//     if (sender.url == blacklistedWebsite)
//       return;  // don't allow this web page access
//     if (request.openUrlInEditor)
//       openUrl(request.openUrlInEditor);
//   	  console.log('third')
//   });