var app = require('app');
var BrowserWindow = require('browser-window');
var win = null;
app.on('ready', function() {
	win = new BrowserWindow( {
		height: 720,
		width: 1280,
	});
	win.loadURL('file://'  + __dirname + '/index.html');
});