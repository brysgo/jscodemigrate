/*
 *  Copyright (c) 2015 Christoph Pojer
 *
 *  This source code is licensed under the MIT license found here:
 *  https://github.com/cpojer/js-codemod
 *
 */

module.exports = {
  paths: [ 'src/test.js' ],
  transform: ({file, root, api, options}) => {
    const j = api.jscodeshift;

    const printOptions = options.printOptions || {quote: 'single'};

    const ARGUMENTS = 'arguments';
    const ARGS = 'args';

    const createArrowFunctionExpression = (fn, args) =>
      j.arrowFunctionExpression(
        (fn.params || []).concat(j.restElement(args)),
        fn.body,
        fn.generator
      );

    const filterArrowFunctions = path => {
      while (path.parent) {
        switch (path.value.type) {
          case 'ArrowFunctionExpression':
            if (j(path).find(j.Identifier, {name: ARGS}).size()) {
              console.error(
                file.path + ': arrow function uses "' + ARGS + '" already. ' +
                'Please rename this identifier first.'
              );
              return false;
            }
            return true;
          case 'FunctionExpression':
          case 'MethodDeclaration':
          case 'Function':
          case 'FunctionDeclaration':
            return false;
          default:
            break;
        }
        path = path.parent;
      }
      return false;
    };

    const updateArgumentsCalls = path => {
      var afPath = path;
      while (afPath.parent) {
        if (afPath.value.type == 'ArrowFunctionExpression') {
          break;
        }
        afPath = afPath.parent;
      }

      const {value: fn} = afPath;
      const {params} = fn;
      const param = params[params.length - 1];
      var args;
      if (param && param.type == 'RestElement') {
        params.pop();
        args = param.argument;
      } else {
        args = j.identifier(ARGS);
      }
      j(afPath).replaceWith(createArrowFunctionExpression(fn, args));

      if (params.length) {
        j(path).replaceWith(
          j.arrayExpression(params.concat(j.spreadElement(args)))
        );
      } else {
        j(path).replaceWith(args);
      }
    };

    const didTransform = root
      .find(j.Identifier, {name: ARGUMENTS})
      .filter(filterArrowFunctions)
      .forEach(updateArgumentsCalls)
      .size() > 0;

      return {
        didTransform,
        root,
        printOptions
      };
  }
}
