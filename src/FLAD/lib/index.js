'use strict';

Object.defineProperty(exports, '__esModule', {value: true});
require('./paho-mqtt');
const storage = require('./storage');
function initialize() {
  global.localStorage = storage;
}
exports.default = initialize;