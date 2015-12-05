var Runner = require('jscodeshift/dist/Runner');

module.exports = {
  run: function({run, generate, test, verbose}) {
    var conf = require('rc')('codemod', {
      verbose,
      paths: [process.cwd()]
    }, true);
    if (run) {
      return Runner.run(
        __dirname + '/Codeshift.js',
        conf.paths,
        conf
      );
    }
  }
};
