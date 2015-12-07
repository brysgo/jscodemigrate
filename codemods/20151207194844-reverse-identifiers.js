
module.exports = {
  transform: ({file, root, api, options}) => {
    const j = api.jscodeshift;
    const {expression, statement, statements} = j.template;

    const printOptions = options.printOptions || {};

    const didTransform = true;
    
    root.find(j.Identifier).replaceWith(
      p => j.identifier(p.node.name.split('').reverse().join(''))
    )

    return {
      didTransform,
      root,
      printOptions
    };
  }
}