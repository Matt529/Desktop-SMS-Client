(function() {
  const path = require('path');
  const jQuery = require('jquery');

  const utility = require(path.join(__dirname, 'scripts', 'utility'));
  utility.ifDebug(require('debug-menu').install, this);

  // Capture Elements
  const webview = jQuery('.yappy')[0];

  // Listens for events that would open a new tab or window
  // Redirects to native browser
  webview.addEventListener('new-window', function(e) {
    utility.openExternalUrl(e.url);
  });
})();
