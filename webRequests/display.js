chrome.extension.onMessage.addListener(

    function(request, sender) {
        var style = document.getElementById("style_web_request_elements");
        
        if (style == null){
            style = document.createElement("style");
            style.setAttribute("rel", "stylesheet");
            style.setAttribute("type", "text/css");
            style.id = "style_web_request_elements";
            
            style.appendChild(document.createTextNode("#div_wi_show_webrequests{background-color: white; font-family: arial; z-index: 1000000; position: fixed; top: 0; right: 0; width: 20%; height: 100%; padding-left: 10px; padding-right: 20px; overflow-y: scroll; border-left-style: solid; border-left-color: black; border-left-width: 1px;}"));
            style.appendChild(document.createTextNode(".btn_request{margin-top: 5px; border-radius: 5px; width: 100%; font-size: 14px; color: #333333; background-color: white; cursor: pointer; word-wrap: break-word; padding: 5px; text-align: left; border-color: black; border-style: solid; border-width: 1px;}"));
            style.appendChild(document.createTextNode(".btn_request:hover{background-color: #dddddd;}"));
            style.appendChild(document.createTextNode("body{width: 80%;}"));
            style.appendChild(document.createTextNode(".highlightedFrame{border-style:solid !important; border-color:yellow !important; border-width: 3px !important; z-index:1000000 !important;}"));
            
            document.getElementsByTagName("head")[0].appendChild(style);
        }
        
        var script = document.getElementById("script_show_webrequest_elements");
        
        if (script == null){
            script = document.createElement("script");
            script.type = "text/javascript";
            script.id = "script_show_webrequest_elements";
            
            script.text = '' + 
                'function lcs(a, b) {var aSub = a.substr(0, a.length - 1); var bSub = b.substr(0, b.length - 1); if (a.length === 0 || b.length === 0) { return "";} else if (a.charAt(a.length - 1) === b.charAt(b.length - 1)) { return lcs(aSub, bSub) + a.charAt(a.length - 1);} else { var x = lcs(a, bSub); var y = lcs(aSub, b); return (x.length > y.length) ? x : y;} }' +
                'function isFrame(sTagName){if (sTagName.toLowerCase() == "div" || sTagName.toLowerCase() == "img" || sTagName.toLowerCase() == "iframe" || sTagName.toLowerCase() == "body" || sTagName.toLowerCase() == "video" ||  sTagName.toLowerCase() == "object" ||  sTagName.toLowerCase() == "embed")return true; return false;}' +
                'function highlightElement(obj){' +
                    'var totalCode = document.getElementsByTagName("body")[0].innerHTML;' +
                    'var insertText = \' class="highlightedFrame" \'; var insertText2 = " highlightedFrame ";' +
                    'totalCode = totalCode.replace(/class="highlightedFrame"/g, "");' +
                    'totalCode = totalCode.replace(/ highlightedFrame /g, "");' +
                    'document.getElementsByTagName("body")[0].innerHTML = totalCode;' +
                    'var searchPath = obj.getAttribute("attrib");' +
                    'for(var nPosition = totalCode.length - 1;nPosition >= 0;){' +
                        'totalCode = document.getElementsByTagName("body")[0].innerHTML;' +
                        'lastSearchPosition = totalCode.lastIndexOf(searchPath, nPosition);sTagName = "";' +
                        'for (;lastSearchPosition >= 0 && !isFrame(sTagName);){' +
                            'nPosition = totalCode.lastIndexOf("<", lastSearchPosition) + 1; lastSearchPosition = nPosition - 2; sTagName = "";' +
                            'while(totalCode.substring(nPosition, nPosition + 1) != " "){sTagName += totalCode.substring(nPosition, nPosition + 1); nPosition ++;}' +
                        '}' +            
                        'if (lastSearchPosition < 0)break;' +
                        'n1 = totalCode.indexOf(">", nPosition); n2 = totalCode.indexOf(" class", nPosition); quote1 = ' + "'\"'" + '; quote2 = "\'";' +                    
                        'if (n2 != -1 && n1 > n2){' +
                            'while(totalCode.substring(n2, n2 + 1) != quote1 &&  totalCode.substring(n2, n2 + 1) != quote2){n2 ++;}' +
                            'document.getElementsByTagName("body")[0].innerHTML = totalCode.substring(0, n2 + 1) + insertText2 + totalCode.substring(n2 + 1);' +
                        '} else {' +
                            'document.getElementsByTagName("body")[0].innerHTML = totalCode.substring(0, nPosition) + insertText + totalCode.substring(nPosition);' +
                        '}' +
                        'nPosition = lastSearchPosition;' +
                    '}' +
                '}' +
            '';
            
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        var requestDiv = document.createElement("div");
        requestDiv.id = "div_wi_show_webrequests";
        
        var bodyString = document.getElementsByTagName("body")[0].innerHTML;
        
        var uniqueNames = [];

        for(var i in request.bl){
            if(uniqueNames.indexOf(request.bl[i]) === -1){
                uniqueNames.push(request.bl[i]);
            }
        }
                
        for (i = 0 ; i < uniqueNames.length; i++){
            if (request.url == uniqueNames[i])continue;
            var searchString = uniqueNames[i].substring(uniqueNames[i].lastIndexOf("/") + 1);
            if (searchString.indexOf("?") != -1)searchString = searchString.substring(0, searchString.indexOf("?"));
            if (searchString.indexOf(".") == -1)continue;
            if (bodyString.indexOf(searchString) <= 0)continue;
            var everyRequest = document.createElement("div");
            everyRequest.className = "btn_request";
            everyRequest.setAttribute("attrib", searchString);
            everyRequest.setAttribute("onclick", "highlightElement(this);");
            everyRequest.innerHTML = uniqueNames[i];
            requestDiv.appendChild(everyRequest);
        }
        
        var previousDiv = document.getElementById("div_wi_show_webrequests");
        
        if (previousDiv == null || getItem("addedCode") != requestDiv.innerHTML){
            setItem("addedCode", requestDiv.innerHTML);
            
            if (previousDiv != null){
                previousDiv.parentNode.removeChild(previousDiv);
            }
            
            document.getElementsByTagName("html")[0].appendChild(requestDiv);
        }
        
        return true;
    }
);

// OPTIONS: Set items in localstore
function setItem(key, value) {
    try {
      log("Inside setItem:" + key + ":" + value);
      window.localStorage.removeItem(key);
      window.localStorage.setItem(key, value);
    }catch(e) {
      log("Error inside setItem");
      log(e);
    }
    log("Return from setItem" + key + ":" +  value);
}

// OPTIONS: Get items from localstore
function getItem(key) {
    var value;
    log('Get Item:' + key);
    try {
      value = window.localStorage.getItem(key);
    }catch(e) {
      log("Error inside getItem() for key:" + key);
      log(e);
      value = "null";
    }
    log("Returning value: " + value);
    return value;
}

// OPTIONS: Zap all items in localstore
function clearStrg() {
    log('about to clear local storage');
    window.localStorage.clear();
    log('cleared');
}

function log(txt) {
//    console.log(txt);
}