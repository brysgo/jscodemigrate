'use strict';

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  run: function run() {
    var cmd = "find . -type f -print | grep 'node_modules/.*/codemods/.*.js'";
    var results = (0, _child_process.execSync)(cmd).toString();
    results.trim().split('\n').forEach(function (result) {
      var isModuleApiChange = false;
      var source = _fs2.default.readFileSync(_path2.default.resolve(result));

      var outputSource = (0, _jscodeshift2.default)(source.toString()).find(_jscodeshift2.default.Property, { key: { name: "moduleApiChange" } }).filter(function (path) {
        isModuleApiChange = true;
        return true;
      }).remove().toSource();

      if (isModuleApiChange) {
        _fs2.default.writeFileSync('./codemods/' + result.split('/').pop(), outputSource);
      }
    });
  }
};