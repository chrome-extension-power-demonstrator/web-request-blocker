var arrUrls = new Array();

chrome.webRequest.onBeforeRequest.addListener(
    
    function(details) {
        arrUrls.push(details.url);
    }, {
        urls: [
            "http://*/*",
            "https://*/*"
        ],
        types: ["main_frame", "sub_frame", "image", "object", "xmlhttprequest", "other"]
    }, ["blocking"]
);

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, {file:'display.js'}, function () {
//        chrome.tabs.sendMessage(tab.id, {bl:arrUrls, url:tab.url});
    });
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        chrome.tabs.executeScript(tab.id, {file:'display.js'}, function () {
            setInterval(function () {chrome.tabs.sendMessage(tab.id, {bl:arrUrls, url:tab.url});}, 3000);
            
        });   
    }
});
