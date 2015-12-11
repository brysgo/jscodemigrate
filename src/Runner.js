var Runner = require('jscodeshift/dist/Runner');
var Generator = require('./Generator');

module.exports = {
  run: function({run, generate, test, verbose, dependencies, args}) {
    if (args && args.length > 0) {
      console.error('Unrecognized subcommand')
      return new Error('Unrecognized subcommand')
    }
    var conf = require('rc')('codemod', {
      verbose,
      paths: [process.cwd()]
    }, true);
    if (generate) {
      Generator.generate(generate);
    } else if (test) {
      return Runner.run(
        __dirname + '/Codeshift.js',
        conf.paths,
        Object.assign({dry: true}, conf)
      );
    } else if (dependencies) {
      console.log('Feature coming soon')
    } else {
      return Runner.run(
        __dirname + '/Codeshift.js',
        conf.paths,
        conf
      );
    }
  }
};
