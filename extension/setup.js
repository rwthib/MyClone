// Runs only when login page opened, pass data back to background.js
document.addEventListener("mail", function(data) {
    chrome.runtime.sendMessage(data.detail);
});