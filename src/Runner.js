var Runner = require('jscodeshift/dist/Runner');

module.exports = {
  run: function({verbose}) {
    var conf = require('rc')('codemod', {
      verbose,
      paths: [process.cwd()]
    }, true);
    return Runner.run(
      __dirname + '/Codeshift.js',
      conf.paths,
      conf
    );
  }
};
