'use strict';

var _child_process = require('child_process');

var fs = require('fs');

function dasherize(name) {
  return require('dashify')(name);
}

var fileTemplate = '\nmodule.exports = {\n  // paths: [ \'optional/\', \'listOfFiles.js\' ], // More specific path to apply\n  // moduleApiChange: true, // Tell jscodemigrate to pull this into dependencies\n  transform: ({file, root, api, options}) => {\n    const j = api.jscodeshift;\n\n    const printOptions = options.printOptions || {};\n\n    const didTransform = false;\n\n    return {\n      didTransform,\n      root,\n      printOptions\n    };\n  }\n}\n';

module.exports = {
  generate: function generate(name) {
    (0, _child_process.execSync)('mkdir -p codemods');
    var templateName = './codemods/' + require('moment')().format("YYYYMMDDHHmmss") + '-' + dasherize(name) + '.js';
    fs.writeFile(templateName, fileTemplate, function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("Created new code migration:");
      console.log(templateName);
    });
  }
};