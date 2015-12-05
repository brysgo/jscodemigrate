module.exports = function(file, api) {
  const j = api.jscodeshift;
  const {expression, statement, statements} = j.template;

  return j(file.source).toSource();
};

