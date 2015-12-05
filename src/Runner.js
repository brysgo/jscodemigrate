var path = require('path');
var Runner = require('jscodeshift/dist/Runner');

module.exports = {
  run: function(options) {
    return Runner.run(
      path.resolve('./Codeshift.js'),
      [process.cwd() + '/src/test.js'], //FIXME: this is until I'm more confident :)
      {babel: true}
    );
  }
};
