#!/usr/bin/env node

'use strict';

var path = require('path');
var Runner = require('../dist/Runner.js');
var program = require('commander');

program
  .version('0.0.1')
  .option('g, generate <name>', 'Generate a new code migration')
  .option('t, test', "Test if you've written deprecated code")
  .option('r, run [file ...]', 'Run js code migrations', {isDefault: true})
  .option('-v, --verbose [level]', 'Show extra information')
  .parse(process.argv);

Runner.run(program);
