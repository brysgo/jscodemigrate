var Runner = require('jscodeshift/dist/Runner');
var Generator = require('./Generator');
var DependencyCrawler = require('./DependencyCrawler');
import { execSync } from 'child_process'

module.exports = {
  run: ({run, generate, test, verbose, dependencies, args}) => {
    if (args && args.length > 0) {
      console.error('Unrecognized subcommand')
      return new Error('Unrecognized subcommand')
    }
    var conf = require('rc')('codemod', {
      verbose,
      paths: [process.cwd()],
      babel: true
    }, true);
    if (generate) {
      Generator.generate(generate);
    } else if (test) {
      console.log("Testing codemods...");
      console.log(execSync('ls codemods').toString());
      return Runner.run(
        __dirname + '/Codeshift.js',
        conf.paths,
        Object.assign({dry: true}, conf)
      );
    } else if (dependencies) {
      DependencyCrawler.run()
    } else {
      console.log("Running codemods...");
      console.log(execSync('ls codemods').toString());
      return Runner.run(
        __dirname + '/Codeshift.js',
        conf.paths,
        conf
      );
    }
  }
};
