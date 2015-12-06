(function() {
  var path = require('path');
  var eShell = require('electron').shell;

  var jQuery = require('jquery');
  var notifier = require('node-notifier');
  var yappy = require(path.join(__dirname, 'scripts', 'src', 'yappy'));

  var apiKey = require('fs').readFileSync(path.join(__dirname, 'mem', 'apikey.txt'));

  // Capture Elements
  var webview = jQuery('.yappy')[0];

  yappy.createYappy(apiKey, function(yappyClient) {
    console.log('Yappy is Here! ' + yappyClient.user.name + " (" + yappyClient.user.email + ")");
  });

  // Listens for events that would open a new tab or window
  // Redirects to native browser
  webview.addEventListener('new-window', function(e) {
    eShell.openExternal(e.url);
  });
})();
