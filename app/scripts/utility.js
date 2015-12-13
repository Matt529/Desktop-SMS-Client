const path = require('path');
const util = require('util');

const winston = require('winston');
const ipcRenderer = require('electron').ipcRenderer;
const electronShell = require('electron').shell;

const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name: 'log',
      filename: 'DesktopSMSClient.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'errorlog',
      filename: 'DesktopSMSClient.error',
      level: 'error',
      handleExceptions: true,
      handleReadableUnhandledException: true
    })
  ],
  exitOnError: false
});

/**
  Attempts to open the given URL in the default external browser for the
  current User.

  @param {String} url Web URL
*/
function openInExternalBrowser(url) {
  if(!util.isNullOrUndefined(url))
    electronShell.openExternal(url);
}

/**
  Retrieves the home directory of the current user from the process environment
  variables. On unix-like systems this is likely to be /home/<username>, on
  Windows systems this will likely be C:\Users\<Username>.

  @returns {String} Home directory of the current user
*/
function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

/**
  Converts the given sequential object to an array starting at the element
  at the given index. Typically this is used for variable arguments using the
  supplied Arguments object as the first parameter.

  @param {Object} args Sequential Object (Usually arguments)
  @param {Number} index starting index
  @returns {Array} Array of elements from sequential object
*/
function toArray(args, index) {
  if(i >= args.length)
    return [];

  var idx = index || 0;
  var arr = new Array(args.length - idx);

  for(var i = idx; i < args.length - idx; i++) {
    arr[i] = args[i];
  }

  return arr;
}

/**
  @returns {Boolean} true if the DEBUG environment variable is set, false otherwise
*/
function isDebug() {
  return "DEBUG" in process.env;
}

/**
  Runs the given function in the given context if and only if isDebug
  returns true. Any arguments after the first two are passed to the given
  function as arguments.

  @param {Function} func Function to call if debug is on
  @param {Object} ctxt Context in which to execute the function. Determines 'this'
  @see isDebug
*/
function ifDebug(func, ctxt) {
  if(!isDebug())
    return;

  var args = toArray(arguments, 2);
  func.apply(ctxt, args);
}

/**
  @returns {Boolean} true if in renderer process, false otherwise (in main process for example)
*/
function isRenderer() {
  return !process || (process.type && process.type === 'renderer');
}

/**
  Convenience object for handling Inter-Process Communication using predetermined
  protocols.

  @namespace
*/
const IpcCommunicator = {
  /**
    Does an API Key Pass handled by the main process

    @param {String} key API Key
    @param {String} url URL relative to root directory to load and re-pass API key
    @param {Boolean} [noDebug] If Debug is On this forces Debug Options ot not run [Optional, Defualt=false]
  */
  doApiKeyPass : function(key, url, noDebug) {
    if(!isRenderer())
      return false;

    if(util.isNullOrUndefined(key) || util.isNullOrUndefined(url)) {
      throw new Error('No Key or URL Provided! Both are required!');
    }

    ipcRenderer.send('pass-api-key', {key: key, url: url, noDebug: noDebug || false});
  },
  /**
    Fires an event that casues the application to completely quit
  */
  doCloseMainWindow : function() {
    ipcRenderer.send('close-main-window');
  }
}

module.exports = {
  'getUserHome' : getUserHome,
  'openExternalUrl' : openInExternalBrowser,
  'isDebug': isDebug,
  'ifDebug': ifDebug,
  'isRenderer': isRenderer,
  'communicator': IpcCommunicator,
  'API_KEY_PATH': path.join(getUserHome(), '.desktopSmsClient', '.apiKey'),
  'LOGGER': logger
};

/**
  Utility Module
  @module
*/
