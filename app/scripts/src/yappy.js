var fs = require('fs');
var path = require('path');
var util = require('util');
var unirest = require('unirest');
var jsonfile = require('jsonfile');

var utility = require('./utility');

/*
  YappyClient constructor, requires an API Key

  Is not public. Use createYappy.
*/
function YappyClient(apiKey) {
  this.apiKey = apiKey;
  this.unreadMap = {};
  this.lastCheckTime = Date.now();
}

/*
  Make a GET request to the given URL wit hthe specific parameters. When a
  reponse is received it is passed to the given callback.
*/
YappyClient.prototype.makeGet = function(url, parameters, callback) {
  return unirest.get(url)
    .field(parameters)
    .set('Access-Token', this.apiKey)
    .type('json')
    .end(callback);
};

/*
  Makes a POST request to the given URL with the specified headers and
  parameters. When a response is received it is passed to the given callback.
*/
YappyClient.prototype.makePost = function(url, headers, parameters, callback) {
  return unirest.post(url)
  .header(headers)
  .field(parameters)
  .set('Access-Token', this.apiKey)
  .type('json')
  .end(callback);
};

// WIP: Notify Unread and New, Keep internal count.
YappyClient.prototype.update = function(unreadCallback, newCallback) {
  var devices = this.devices;
  var cursor = 1;

  var self = this;

  var params = function() {
    return {
      'results': 500,
      'include_names': true,
      'modified_after': self.lastCheckTime,
      'active': true
    };
  };

  for(var i in devices) {
    var device = devices[i].identifier;

    this.makeGet('https://api.yappy.im/v1/devices/'+ device + '/conversations', params, respFunc);
  }

  this.lastCheckTime = Date.now();
};

// Creates a Yappy Client and initializes data, returned to callback
module.exports.createYappy = function(apiKey, callback) {
  var yappy = new YappyClient(apiKey);

  yappy.makeGet('https://api.yappy.im/v1/users/me', {}, function(response) {
    yappy.user = {
      name: response.body.name,
      email: response.body.email,
      avatar: response.body.avatar_url,
    };

    return yappy.makeGet('https://api.yappy.im/v1/devices', {}, function(response) {
      yappy.devices = response.body.devices;
      return callback(yappy);
    });
  });
};
