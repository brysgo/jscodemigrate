var fs = require('fs');
import { execSync } from 'child_process'

function dasherize(name) {
  return require('dashify')(name);
}

var fileTemplate = `
module.exports = {
  // paths: [ 'optional/', 'listOfFiles.js' ], // More specific path to apply
  // moduleApiChange: true, // Tell jscodemigrate to pull this into dependencies
  transform: ({file, root, api, options}) => {
    const j = api.jscodeshift;

    const printOptions = options.printOptions || {};

    const didTransform = false;

    return {
      didTransform,
      root,
      printOptions
    };
  }
}
`

module.exports = {
  generate: function(name) {
    execSync('mkdir -p codemods')
    var templateName = `./codemods/${require('moment')().format("YYYYMMDDHHmmss")}-${dasherize(name)}.js`
    fs.writeFile(templateName, fileTemplate, function(err) {
      if(err) {
        return console.log(err);
      }

      console.log("Created new code migration:");
      console.log(templateName);
    });
  }
}
