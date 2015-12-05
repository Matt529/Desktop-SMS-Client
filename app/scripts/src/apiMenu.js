var fs = require('fs');
var ipcRend = require('electron').ipcRenderer;

function verifyAPIKey(key) {
	return key && key.length > 0;
}

function getAPIKey() {
	saveAPIKey(document.getElementById('apiField').value);
}

function saveAPIKey(key) {
	if(key === undefined) {
		key = '';
	}

	fs.writeFile(__dirname + '/mem/apikey.txt', key, function(err) {
		if(err) {
			return console.log(err);
		} else if (verifyAPIKey(key)) {
			ipcRend.send('api-key-ready', true);
		}
	});
}

function loadAPIKey() {
	key = fs.readFileSync(__dirname + '/mem/apikey.txt');
	if (verifyAPIKey(key)) {
		ipcRend.send('api-key-ready', true);
	}
}

function handleEnterKeyPress(e) {
	e = e || window.event;
	if(e.keyCode == 13) {
		document.getElementById('enterButton').click();
		return false;
	}
	return true;
}
