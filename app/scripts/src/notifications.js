(function() {
  const path = require('path');
  const ipcRend = require('electron').ipcRenderer;

  const notifier = require('node-notifier');

  const utility = require(path.join(__dirname, 'scripts', 'utility'));
  const yappy = require(path.join(__dirname, 'scripts', 'yappy'));
  const logger = utility.LOGGER;

  ipcRend.on('receive-api-key', function(event, key) {
    yappy.createYappy(key, function(err, yappyClient) {
      if(err)
        console.error(err);
      else
        console.log('Yappy is Here! ' + yappyClient.user.name + " (" + yappyClient.user.email + ")");
    });
  });
})();
