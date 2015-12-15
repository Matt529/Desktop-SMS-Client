(function() {
  const fs = require('fs');
  const fse = require('fs-extra');
  const path = require('path');

  const jQuery = require('jquery');
  const ipcRend = require('electron').ipcRenderer;
  const utility = require(path.join(__dirname, 'scripts', 'utility'));
  const ipcComms = utility.communicator;
  const logger = utility.logger;

  const apiKeyPath = utility.API_KEY_PATH;

  utility.ifDebug(require('debug-menu').install, this);

  // jQuery Selectors
  const enterBtn = jQuery('#enterButton');
  const takeMeBtn = jQuery('#takeMeThereButton');
  const apiField = jQuery('#apiField');

  // Verify Key is Correctly Formatted
  function verify(key) {
    return key && key.length > 0 && /^[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}$/.test(key);
  }

  // Get the API Key from File or Input Field
  function getAPIKey(fromFile) {
    var key;

    if (fromFile)
      key = loadAPIKey();
    else
      key = apiField.val();

    if(!key)
      logger.error((fromFile ? 'Load From File: ' : 'Load From Field: ') + 'Undefined API Key!');

    if (verify(key)) {
      saveAPIKey(key);
      return key;
    } else {
      return null;
    }
  }

  // Save API Key to File
  function saveAPIKey(key) {
    fse.outputFile(apiKeyPath, key, function(err) {
      if(err)
        logger.error(err);
      else
        logger.info('Wrote API key to ' + apiKeyPath);
    });
  }

  // Load API Key from File
  function loadAPIKey() {
    try {
      fs.accessSync(apiKeyPath, fs.F_OK);
      return fs.readFileSync(apiKeyPath);
    } catch(e) {
      logger.error(e);
      logger.error('API Key File Not Found!');
    }
  }

  // Register Key Press Handler for text field
  apiField.keypress(function(e) {
    if (e.which == 13) {
      enterBtn.click();
    }
  });

  // Register Click Handler
  enterBtn.click(function(e) {
    var key = getAPIKey(false);
    if (key)
      ipcComms.doApiKeyPass(key, 'index.html');
  });

  takeMeBtn.click(function(e) {
    utility.openExternalUrl('https://www.yappy.im/web/#Settings');
  });

  {
    var key;
    // First Check if Valid API Key already in File
    if ((key = getAPIKey(true)))
      ipcComms.doApiKeyPass(key, 'index.html');
  }
})();
