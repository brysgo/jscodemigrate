var Runner = require('jscodeshift/dist/Runner');
var Generator = require('./Generator');

module.exports = {
  run: function({run, generate, test, verbose}) {
    var conf = require('rc')('codemod', {
      verbose,
      paths: [process.cwd()]
    }, true);
    if (generate) {
      Generator.generate(generate);
    } else if (test) {
      console.log("Feature coming soon...");
    } else if (run) {
      return Runner.run(
        __dirname + '/Codeshift.js',
        conf.paths,
        conf
      );
    }
  }
};
