'use strict';

var _child_process = require('child_process');

var Runner = require('jscodeshift/dist/Runner');
var Generator = require('./Generator');
var DependencyCrawler = require('./DependencyCrawler');


module.exports = {
  run: function run(_ref) {
    var _run = _ref.run,
        generate = _ref.generate,
        test = _ref.test,
        verbose = _ref.verbose,
        dependencies = _ref.dependencies,
        args = _ref.args;

    if (args && args.length > 0) {
      console.error('Unrecognized subcommand');
      return new Error('Unrecognized subcommand');
    }
    var conf = require('rc')('codemod', {
      verbose: verbose,
      paths: [process.cwd()],
      babel: true
    }, true);
    if (generate) {
      Generator.generate(generate);
    } else if (test) {
      console.log("Testing codemods...");
      console.log((0, _child_process.execSync)('ls codemods').toString());
      return Runner.run(__dirname + '/Codeshift.js', conf.paths, Object.assign({ dry: true }, conf));
    } else if (dependencies) {
      DependencyCrawler.run();
    } else {
      console.log("Running codemods...");
      console.log((0, _child_process.execSync)('ls codemods').toString());
      return Runner.run(__dirname + '/Codeshift.js', conf.paths, conf);
    }
  }
};