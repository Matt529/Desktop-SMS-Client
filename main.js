var path = require('path');
var app = require('app');
var BrowserWindow = require('browser-window');

var ipc = require('electron').ipcMain;
var Tray = require('electron').Tray;

var utility = require(path.join(__dirname, 'app', 'scripts', 'utility'));
var ipcComms = utility.communicator;

var iconPath = path.join(__dirname, 'assets', 'win', 'icon.png');
var win;

app.on('ready', function() {
	win = new BrowserWindow( {
		height: 720,
		width: 1280,
		title: 'Desktop SMS Client',
		icon: iconPath,
	});

	appIcon = new Tray(iconPath);
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

ipc.on('pass-api-key', function(event, opts) {
	if(opts.key && opts.url) {
		win.loadURL('file://' + __dirname + '/app/' + opts.url);

		if(!opts.noDebug) {
			utility.ifDebug(win.toggleDevTools, win);
		}

		win.webContents.once('dom-ready', function() {
			// Notify renderer process with the shared apiKey
			// wait 7s before attempting after dom-ready is fired
			setTimeout(function() {
				win.webContents.send('receive-api-key', opts.key);
			}, process.env['YAPPY_CLIENT_DELAY'] || 7000);
		});

	} else {
		console.error('Failed to pass api key, need url and key!');
	}
});
