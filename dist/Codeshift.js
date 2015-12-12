'use strict';

var path = require('path');
var require_tree = require('require-tree');
var codemods = require_tree(process.cwd() + '/codemods');

function inPath(needle, haystack) {
  return haystack.reduce(function (found, aPath) {
    return found || path.resolve(needle).indexOf(path.resolve(aPath)) == 0;
  }, false);
}

module.exports = function (file, api, options) {
  var j = api.jscodeshift;
  var root = j(file.source);
  var didTransform = false;
  var printOptions = {};
  for (var _name in codemods) {
    var codemod = codemods[_name];
    if (!codemod.paths || inPath(file.path, codemod.paths)) {
      var result = codemod.transform({ root: root, file: file, api: api, options: options });
      didTransform = didTransform || result.didTransform;
      root = result.root;
      printOptions = Object.assign(printOptions, result.printOptions);
    }
  }
  if (didTransform) {
    return root.toSource(printOptions);
  } else {
    return null;
  }
};