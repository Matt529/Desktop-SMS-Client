const path = require('path');
const util = require('util');
const winston = require('winston');
const isRenderProcess = require(path.join(__dirname, 'utility')).isRenderer;

// Import Common Transport Tools
const winstonDir = path.dirname(require.resolve('winston'));
const common = require(path.join(winstonDir, 'winston', 'common'));

/**
  Creates a new Transport that handles sending log data to console.log or
  console.error so that the information is displayed to the BrowserConsole if
  the current process is the renderer process.

  @constructor
  @param {Object} [opts] Transport Options
  @param {String} [opts.name=BrowserConsole] Logger name
  @param {String} [opts.level=info] Log level to start recording at
  @extends winston.Transport
*/
var BrowserConsole = winston.transports.BrowserConsole = function(opts) {
  opts = opts || {};

  this.name = opts.name || 'BrowserConsole';
  this.level = opts.level || 'info';
};

util.inherits(BrowserConsole, winston.Transport);

BrowserConsole.prototype.log = function(level, msg, meta, callback) {
  if(this.silent)
    return callback(null, true);

  if(!isRenderProcess())
    return callback(null, false);

  var output = common.log({
    level: level,
    message: msg,
    meta: meta,
    colorize: false,
    timestamp: true,
    label: '',
    json: false
  });

  if(level === 'error')
    console.error(output + this.eol);
  else
    console.log(output + this.eol);

  this.emit('logged');
  callback(null, true);
};

module.exports.BrowserConsole = BrowserConsole;

/**
  Custom Winston Transports Module
  @module
*/
