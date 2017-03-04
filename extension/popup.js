document.getElementById("cmd_newtab").addEventListener("click", newTab);

function newTab() {
    chrome.tabs.create({});
    console.log("Tab created!");
}