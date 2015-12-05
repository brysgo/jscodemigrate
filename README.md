# Migrate your code like you do with your database!

This is a simple wrapper around jscodeshift that give you a migration like interface.

Install in your project:

    npm install jscodemigrate --save-dev

Generate your first codemod:

    jscodemigrate g switch-to-es6-classes
    
And you're off! Look in `codemods/` to see your newly generated jscodemigration.

I would recommended taking a look at the template, and also [js-codemod](https://github.com/cpojer/js-codemod)
for ideas.

# TODO

1) Get suggestions from you
2) Add `test` subcommand to check code for regressions
3) More examples and documentation

# Made possible by
* [Codeshift](https://github.com/facebook/jscodeshift) and everyone who made it possible
* [js-codemod](https://github.com/cpojer/js-codemod), for the great library of examples
