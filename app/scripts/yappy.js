const fs = require('fs');
const path = require('path');
const util = require('util');

const unirest = require('unirest');
const jsonfile = require('jsonfile');
const async = require('async');

const utility = require('./utility');

/**
  YappyClient constructor, requires an API Key. This constructor does little on it's
  own, see createYappy

  Is not public. Use createYappy.

  @param {String} apiKey Yappy API key for specific user
  @class
*/
function YappyClient(apiKey) {
  this.apiKey = apiKey;
  this.unreadMap = {};
  this.lastCheckTime = Date.now();
}

/**
  Make a GET request to the given URL wit hthe specific parameters. When a
  reponse is received it is passed to the given callback.

  @param {String} url - URL to make request to
  @param {Object} parameters - Enumeration of GET params
  @param {Function} callback - Callback once request returns, takes response object
*/
YappyClient.prototype.makeGet = function(url, parameters, callback) {
  return unirest.get(url)
    .field(parameters)
    .set('Access-Token', this.apiKey)
    .type('json')
    .end(callback);
};

/**
  Makes a POST request to the given URL with the specified headers and
  parameters. When a response is received it is passed to the given callback.

  @param {String} url - URL to make request to
  @param {Object} headers - POST Header Enumeration
  @param {Object} parameters - Enumeration of POST params
  @param {Function} callback - Callback once request returns, takes response object
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

/**
  Creates a Yappy Client and initializes the data, specifically user and device
  data for later use.

  @param {String} apiKey - Yappy API Key for specific user
  @param {yappyCallback} cb - Callback that takes (error, yappyClient)
*/
module.exports.createYappy = function(apiKey, cb) {
  var yappy = new YappyClient(apiKey);

  /**
    Retrieves user details for yappy Client
    @param {retrieveUserCallback} callback
  */
  function retrieveUser(callback) {
    yappy.makeGet('https://api.yappy.im/v1/users/me', {}, function(resp) {
      var user = {
        name: resp.body.name,
        email: resp.body.email,
        avatar: resp.body.avatar_url
      };

      return callback(null, user);
    });
  }

  /**
    Retrieves device details for yappy client
    @param {retrieveDevicesCallback} callback
  */
  function retrieveDevices(callback) {
    yappy.makeGet('https://api.yappy.im/v1/devices', {}, function(response) {
      return callback(null, response.body.devices);
    });
  }

  async.series({
    user: retrieveUser,
    devices: retrieveDevices
  }, function(err, results) {
    yappy.user = results.user;
    yappy.devices = results.devices;
    cb(err, yappy);
  });
};

/**
  Yappy Client Module
  @module
*/

/**
  @callback yappyCallback
  @param {YappyClient} yappy Yappy Client Object with Initialized Data
*/

/**
  @callback retrieveUserCallback
  @param {Error|Null} err The Error that Occurred or Null
  @param {Object} user User Object
  @param {String} user.name User name
  @param {String} user.email User email
  @param {String} user.avatar URL Location of User's Avatar Image
*/

/**
  @callback retrieveDevicesCallback
  @param {Error|Null} err The Error that Occurred or Null
  @param {Object[]} devices Array of Device Objects tied to User
*/
