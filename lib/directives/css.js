/**
 * @fileoverview CSS directive handler.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _assets = require('../assets');

var _assets2 = _interopRequireDefault(_assets);

var _commonDirectory = require('../common/directory');

var _commonDirectory2 = _interopRequireDefault(_commonDirectory);

var _commonFile = require('../common/file');

var _commonFile2 = _interopRequireDefault(_commonFile);

var _buildersScss = require('../builders/scss');

var _buildersScss2 = _interopRequireDefault(_buildersScss);

var _parsersCss = require('../parsers/css');

var _parsersCss2 = _interopRequireDefault(_parsersCss);

var _transformer = require('../transformer');

var Css = (function (_Transformer) {
  _inherits(Css, _Transformer);

  function Css() {
    _classCallCheck(this, Css);

    _get(Object.getPrototypeOf(Css.prototype), 'constructor', this).apply(this, arguments);
  }

  // singleton

  _createClass(Css, [{
    key: 'transform',

    /**
     * @param {Vinyl} The vinyl file.
     * @param {Object} options .
     * @return {Vinyl} Transformed vinyl.
     */
    value: function transform(vFile, options) {
      var parsed = _parsersCss2['default'].parse(vFile.contents.toString());
      var code = this.generateCode(parsed, this.getRequires(parsed), options);
      vFile.contents = new Buffer(code);
      return vFile;
    }

    /**
     * @param {Root} parsed PostCSS AST.
     * @return {Array.<String>} Required paths.
     */
  }, {
    key: 'getRequires',
    value: function getRequires(parsed) {
      var _this = this;

      var comment = parsed.comment;
      if (!comment) {
        return [];
      }

      var requires = [];
      var stubs = [];

      this.getDirectives(comment.text).forEach(function (directive) {
        switch (directive.directive) {
          case 'require':
            requires.push(_this.requireDirective(directive.path));
            break;
          case 'require_tree':
            requires.push.apply(requires, _this.requireTreeDirective(directive.path));
            break;
          case 'stub':
            stubs.push(_this.stubDirective(directive.path));
            break;
        }
      });

      return requires.filter(function (req) {
        return 0 > stubs.indexOf(req);
      });
    }

    /**
     * @param {Css} parsed.
     * @param {Array.<String>} Required paths.
     * @param {Object} options .
     * @return {String} Replaced CSS String.
     */
  }, {
    key: 'generateCode',
    value: function generateCode(parsed, requires, options) {
      var buf = requires.map(function (req) {
        var res = _buildersScss2['default'].transform(_commonFile2['default'].createVinyl(req), options);
        return res.contents.toString();
      });
      return buf.join('\n') + '\n' + parsed.code();
    }

    /**
     * @param {String} p File path.
     * @return {String} Asset path.
     */
  }, {
    key: 'requireDirective',
    value: function requireDirective(p) {
      return _assets2['default'].findStyleSheet(p);
    }

    /**
     * @param {String} p Directory path.
     * @return {Array.<String>} Asset paths.
     */
  }, {
    key: 'requireTreeDirective',
    value: function requireTreeDirective(p) {
      return _lodash2['default'].flatten(_assets2['default'].stylesheetPaths.map(function (stylesheetPath) {
        var dirPath = _path2['default'].join(stylesheetPath, p);
        return _commonDirectory2['default'].list(dirPath, true).map(function (p2) {
          return _assets2['default'].findStyleSheet(p2, true);
        });
      }));
    }

    /**
     * @param {String} p File path.
     * @return {String} Asset path.
     */
  }, {
    key: 'stubDirective',
    value: function stubDirective(p) {
      return _assets2['default'].findStyleSheet(p);
    }

    /**
     * @param {String} comment .
     * @return {Object} Analyzed directive.
     */
  }, {
    key: 'getDirectives',
    value: function getDirectives(comment) {
      return comment.split('\n').map(function (line) {
        var text = line.replace(/^.*=/, '').trim();
        if (text.match(/^(require|require_tree|stub)\s(.+)/)) {
          return { directive: RegExp.$1, path: RegExp.$2 };
        } else {
          return { directive: null, path: null };
        }
      });
    }
  }]);

  return Css;
})(_transformer.Transformer);

exports.Css = Css;
exports['default'] = new Css();