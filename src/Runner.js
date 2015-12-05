var Runner = require('jscodeshift/dist/Runner');

module.exports = {
  run: function({verbose}) {
    return Runner.run(
      __dirname + '/Codeshift.js',
      [process.cwd()], //FIXME: this is until I'm more confident :)
      {verbose}
    );
  }
};
