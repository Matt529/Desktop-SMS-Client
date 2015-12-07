var app = require('app');
var BrowserWindow = require('browser-window');
var win = null;
var apiKey;
var ipc = require('electron').ipcMain;
var Tray = require('electron').Tray;

app.on('ready', function() {
	win = new BrowserWindow( {
		height: 720,
		width: 1280,
		title: 'Desktop SMS Client',
		icon: __dirname + '/assets/win/icon.png',
	});

	appIcon = new Tray(__dirname + '/assets/win/icon.png');
	appIcon.setToolTip('Desktop SMS Client');

	win.loadURL('file://' + __dirname + '/app/apiMenu.html');
});

app.on('window-all-closed', function() {
	if(process.platform != 'darwin') {
		app.quit();
	}
})

ipc.on('close-main-window', function() {
	app.quit();
});

ipc.on('api-key-ready', function(flag) {
	if(flag) {
		win.loadURL('file://' + __dirname + '/app/index.html');
	}
});
