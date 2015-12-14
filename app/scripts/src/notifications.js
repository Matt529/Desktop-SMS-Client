(function() {
  const path = require('path');
  const notifier = require('node-notifier');

  const utility = require(path.join(__dirname, 'scripts', 'utility'));
  const yappy = require(path.join(__dirname, 'scripts', 'yappy'));

  const ipcComms = utility.communicator;
  const logger = utility.LOGGER;

  ipcComms.receiveApiKey(function(event, key) {
    yappy.createYappy(key, function(err, yappyClient) {
      try {
        throw new Error('TEST');
      } catch(e) {
        logger.error(e);
      }


      if(err)
        logger.error(err);
      else
        logger.info('Yappy is Here! %s (%s)', yappyClient.user.name, yappyClient.user.email);
    });
  });
})();
