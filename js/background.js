chrome.extension.onRequest.addListener(function(data, sender, sendResponse){
	switch( data.query ){
	case 'list':
		chrome.tabs.getAllInWindow( sender.tab.windowId, sendResponse );
	break;
	case 'tab':
		chrome.tabs.update( data.id, {selected: true} );
	break;
	case 'newtab':
		chrome.tabs.create({ 'url' :chrome.extension.getURL('newtab.html') });
	break;
	case 'event':
		switch( data.e.eventType ){
		case 'mousemove':
			chrome.tabs.executeScript(sender.tab.id, {code: 'eventTransmitter({"eventType": "mousemove", "screenX":'+data.e.screenX+', "screenY":'+data.e.screenY+'})', allFrames:false});
		break;
		case 'keydown':
			chrome.tabs.executeScript(sender.tab.id, {code: 'eventTransmitter({"eventType": "keydown", "keyCode":'+data.e.keyCode+', "ctrlKey":'+data.e.ctrlKey+'})', allFrames:false});
		break;
		case 'keyup':
			chrome.tabs.executeScript(sender.tab.id, {code: 'eventTransmitter({"eventType": "keyup", "keyCode":'+data.e.keyCode+', "ctrlKey":'+data.e.ctrlKey+'})', allFrames:false});
		break;
		}
	break;
	case 'favorites':
		chrome.bookmarks.getTree(function(tree){ sendResponse(tree); });
	break;
	}
});