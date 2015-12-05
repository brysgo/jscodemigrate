require('babel-core/register');
var path = require('path');
var require_tree = require('require-tree');
var codemods = require_tree( process.cwd() + '/codemods');

console.log("Running codemods...");
console.log(Object.keys(codemods).join('\n'));

function inPath(needle, haystack) {
  return haystack.reduce(function(found, aPath) {
    return found || (path.resolve(needle).indexOf(path.resolve(aPath)) == 0);
  }, false);
}

module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  let root = j(file.source);
  let didTransform = false;
  let printOptions = {};
  for (let name in codemods) {
    let codemod = codemods[name];
    if (inPath(file.path, codemod.paths)) {
      let result = codemod.transform({root, file, api, options});
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
}
