# Migrate your code like you do with your database!

[![Greenkeeper badge](https://badges.greenkeeper.io/brysgo/jscodemigrate.svg)](https://greenkeeper.io/)

[![Join the chat at https://gitter.im/brysgo/jscodemigrate](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/brysgo/jscodemigrate?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Dependency Status](https://david-dm.org/brysgo/jscodemigrate.svg)](https://david-dm.org/brysgo/jscodemigrate)
[![Circle CI](https://circleci.com/gh/brysgo/jscodemigrate.svg?style=svg)](https://circleci.com/gh/brysgo/jscodemigrate)

This is a simple wrapper around jscodeshift that give you a migration like interface.

Install in your project:
    npm install jscodemigrate --save-dev

Generate your first codemod:

    jscodemigrate g switch-to-es6-classes
    
And you're off! Look in `codemods/` to see your newly generated jscodemigration.

I would recommended taking a look at the template, and also [js-codemod](https://github.com/cpojer/js-codemod)
for ideas.

# Pull in codemigrations from npm dependencies

    jscodemigrate deps

# Differences from writing jscodeshift

    module.exports = {
      // Function to export is called transform
      transform: ({file, root, api, options}) => {
        // All the variables are passed in an options hash
        // Included with the usually is a root variable
        // (so that each migration doens't need to reparse the file)
        const j = api.jscodeshift;
        const {expression, statement, statements} = j.template;
    
        const printOptions = options.printOptions || {};
    
        const didTransform = true;
        
        root.find(j.Identifier).replaceWith(
          p => j.identifier(p.node.name.split('').reverse().join(''))
        )
        
        // You'll notice a return hash instead of the usual resulting source string
        return {
          didTransform,
          root,
          printOptions
        };
      }
    }

# Configuration

## .codemodrc file
    { // These options mostly mirror jscodeshift's command line args
      "paths": [ "src/", "tests/", "special/file.js" ], // Paths to search when doing codemods
      "extensions": "js,es6" // Comma separated extensions to consider
    }

## Per code migration config

    module.exports = {
      moduleApiChange: true, // Tell jscodemigrate to pull this into dependencies
      paths: [ "tests/" ], // even if your .codemodrc file looks in all your files, this will only run in 'tests/' directory
      // Tranform is the only thing that isn't optional
      transform: ({file, root, api, options}) => {
        ...
      }
    }

# Made possible by
* [Codeshift](https://github.com/facebook/jscodeshift) and everyone who made it possible
* [js-codemod](https://github.com/cpojer/js-codemod), for the great library of examples
