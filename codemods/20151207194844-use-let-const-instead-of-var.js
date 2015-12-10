/*
 * Copyright (c) 2015 Christoph Pojer
 *
 * This source code is licensed under the MIT license found here:
 * https://github.com/cpojer/js-codemod
 *
 * Transform all your `var`s to `let` and `const`.
 *
 * Does not yet manage things that abuse variable hoisting rules. E.g. current
 * transform will cause this behavioral change:
 *
 * console.log(a); // undefined
 * if (true) {
 *   var a = 0;
 * }
 *
 * console.log(a); // TypeError
 * if (true) {
 *   let a = 0;
 * }
 */
module.exports = {
  transform: ({file, root, api, options}) => {
    const j = api.jscodeshift;
    const {expression, statement, statements} = j.template;

    const printOptions = options.printOptions || {};
  
    /**
     * isMutated utility function to determine whether a VariableDeclaration
     * contains mutations. Takes an optional VariableDeclarator node argument to
     * return only whether that specific Identifier is mutated
     *
     * @param {ASTPath} node VariableDeclaration path
     * @param {ASTNode} [declarator] VariableDeclarator node
     * @return {Boolean}
     */
    const isMutated = (node, declarator) => {
      const scopeNode = node.parent;
  
      const hasAssignmentMutation = j(scopeNode)
        .find(j.AssignmentExpression)
        .filter(n => {
          if (declarator) {
            if (declarator.id.type === 'ObjectPattern') {
              return declarator.id.properties.some(d => d.value.name === n.value.left.name);
            } else if (declarator.id.type === 'ArrayPattern') {
              return declarator.id.elements.some(d =>
                (d.type === 'RestElement' ? d.argument.name : d.name) === n.value.left.name
              );
            }
  
            if (n.value.left.type === 'ObjectPattern') {
              return n.value.left.properties.some(p => p.key.name === declarator.id.name);
            } else if (n.value.left.type === 'ArrayPattern') {
              return n.value.left.elements.some(e =>
                (e.type === 'RestElement' ? e.argument.name : e.name) === declarator.id.name
              );
            }
            return declarator.id.name === n.value.left.name;
          }
  
          if (node.value.declarations.some(d => d.id.name === n.value.left.name)) {
            return true;
          }
        }).size() > 0;
  
      const hasUpdateMutation = j(scopeNode)
        .find(j.UpdateExpression)
        .filter(n => {
          if (declarator) {
            if (declarator.id.type === 'ObjectPattern') {
              return declarator.id.properties.some(d => d.value.name === n.value.argument.name);
            } else if (declarator.id.type === 'ArrayPattern') {
              return declarator.id.elements.some(
                e => (e.type === 'RestElement' ? e.argument.name : e.name) === n.value.argument.name
              );
            }
  
            return declarator.id.name === n.value.argument.name;
          }
  
          if (node.value.declarations.some(d => d.id.name === n.value.argument.name)) {
            return true;
          }
        }).size() > 0;
  
      return hasAssignmentMutation || hasUpdateMutation;
    };
  
    const isAccessedInClosure = (node) => {
  
      return j(node.value.body)
        .find(j.Identifier)
        .filter(n => {
          const declarations = node.value.init ? node.value.init.declarations
                             : node.value.left ? node.value.left.declarations
                             : [];
          if (declarations.some(d => d.id.name === n.value.name)) {
            let parent = n.parent;
            while (parent.value !== node.value.body) {
              parent = parent.parent;
              const {type} = parent.value;
              if (
                'Function' === type ||
                'FunctionDeclaration' === type ||
                'FunctionExpression' === type ||
                'ArrowFunctionExpression' === type
              ) {
                return true;
              }
            }
            return false;
          }
        }).size() > 0;
    };
  
  
    // convert all necessary variable declarations to let or const
    const changedVariableDeclaration = root
      .find(j.VariableDeclaration)
      .filter(
        p => {
          if (
            'ForStatement' === p.parent.value.type ||
            'ForInStatement' === p.parent.value.type ||
            'ForOfStatement' === p.parent.value.type
          ) {
            if (p.value.kind !== 'var') {
              return false;
            }
  
            if (!isAccessedInClosure(p.parent)) {
              p.value.kind = 'let';
            } else {
              console.warn(
                'WARNING: A variable binding in a `for` loop is accessed '+
                'inside a new scope. This could be indicative of a race ' +
                'condition or other unintended access. We have left the ' +
                'binding as a `var`. View the following code at `%s#%s`',
                file.path, p.value.loc.start.line
              );
              console.log(j(p.parent).toSource() + '\n');
            }
            return true;
          } else {
            const lets = [];
            const consts = [];
            p.value.declarations.forEach(decl => {
              if (!decl.init || isMutated(p, decl)) {
                lets.push(decl);
              } else {
                consts.push(decl);
              }
            });
  
            const replaceWith = [];
            if (lets.length) {
              replaceWith.push(j.variableDeclaration('let', lets));
            }
            if (consts.length) {
              replaceWith.push(j.variableDeclaration('const', consts));
            }
  
            if (replaceWith.length) {
              if (p.value.comments || p.value.leadingComments) {
                replaceWith[0].leadingComments = p.value.leadingComments;
                replaceWith[0].comments = p.value.comments;
              }
              j(p).replaceWith(replaceWith);
              return true;
            } else {
              return false;
            }
          }
        }
      ).size() > 0;
  
    // if a iterator statement attempts to reuse a loose iterator variable
    // change it to a let declaration
    const changedStatement = root
      .find(j.Statement)
      .filter(exp => (
        'ForStatement' === exp.value.type ||
        'ForInStatement' === exp.value.type ||
        'ForOfStatement' === exp.value.type
      ))
      .filter(stmt => (
        stmt.value.init && stmt.value.init.type === 'AssignmentExpression'
      ))
      .forEach(p => {
        p.value.init = j.variableDeclaration(
          p.value.type === 'ForStatement' || isMutated(p.value) ? 'let' : 'const',
          [j.variableDeclarator(p.value.init.left, p.value.init.right)]
        );
      }).size() > 0;
  
    const didTransform = changedVariableDeclaration || changedStatement
    
    return {
      didTransform,
      root,
      printOptions
    };
  }
}