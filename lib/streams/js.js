/**
 * @fileoverview JavaScript stream.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _eventStream = require('event-stream');

var _eventStream2 = _interopRequireDefault(_eventStream);

var _buildersJs = require('../builders/js');

var _buildersJs2 = _interopRequireDefault(_buildersJs);

var _directivesJs = require('../directives/js');

var _directivesJs2 = _interopRequireDefault(_directivesJs);

var _transformer = require('../transformer');

function defaultOptions() {
  return { precompile: false };
}

/**
 * @params {Object} options .
 */

exports['default'] = function (options) {
  options = (0, _objectAssign2['default'])(defaultOptions(), options);

  return _eventStream2['default'].through(function (vFile) {
    vFile = (0, _transformer.transformation)([_buildersJs2['default'], _directivesJs2['default']], vFile, options);
    this.emit('data', vFile);
  });
};

module.exports = exports['default'];