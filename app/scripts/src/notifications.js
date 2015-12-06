(function() {
  var path = require('path');

  var jQuery = require('jquery');
  var notifier = require('node-notifier');
  var yappy = require(path.join(__dirname, 'scripts', 'src', 'yappy'));

  var apiKey = require('fs').readFileSync(path.join(__dirname, 'mem', 'apikey.txt'));
  yappy.createYappy(apiKey, function(yappyClient) {
    console.log('Yappy is Here! ' + yappyClient.user.name + " (" + yappyClient.user.email + ")");
  });
})();
