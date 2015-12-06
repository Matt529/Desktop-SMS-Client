(function() {
  // Cache when found
  var key;

  var fs = require('fs');
  var path = require('path');

  var jQuery = require('jquery');
  var ipcRend = require('electron').ipcRenderer;

  // jQuery Selectors
  var enterBtn = jQuery('#enterButton');
  var takeMeBtn = jQuery('#takeMeThereButton');
  var apiField = jQuery('#apiField');

  // Verify Key is Correctly Formatted
  function verify(key) {
    return key && key.length > 0;
  }

  // Get the API Key from File or Input Field
  function getAPIKey(fromFile) {
    if (key && verify(key))
      return key;

    if (fromFile)
      key = loadAPIKey();
    else
      key = apiField.val();

    if (verify(key)) {
      saveAPIKey(key);
      return key;
    } else {
      return null;
    }
  }

  // Save API Key to File
  function saveAPIKey(key) {
    fs.writeFile(path.join(__dirname, 'mem', 'apikey.txt'), key, function(err) {
      if (err) {
        return console.log(err);
      } else if (verifyAPIKey(key)) {
        ipcRend.send('api-key-ready', true);
      }
    });
  }

  // Load API Key from File
  function loadAPIKey() {
    return fs.readFileSync(path.join(__dirname, 'mem', 'apiKey.txt'));
  }

  // Register Key Press Handler for text field
  apiField.keypress(function(e) {
    if (e.which == 13) {
      enterBtn.click();
    }
  });

  // Register Click Handler
  enterBtn.click(function(e) {
    if (getAPIKey(false))
      ipcRend.send('api-key-ready', true);
  });

  takeMeBtn.click(function(e) {
    require('electron').shell.openExternal('https://www.yappy.im/web/#Settings');
  });

  // First Check if Valid API Key already in File
  if (getAPIKey(true)) {
    ipcRend.send('api-key-ready', true);
  }
})();
