'use strict';

import promisify from 'promisify-node'
import { exec } from 'child_process'
let execPromise = promisify(exec)

describe('running code migrations', () => {

  pit('runs all the migrations on the sample file', () => {
    return Promise.all([
      'git checkout test/sample.js',
      'jscodemigrate run',
    ].map((command) => {
      return execPromise(command);
    })).then(() => {
      return execPromise('diff test/sample.js test/sample.expected.js').then((stdout) => {
        expect(stdout).toEqual('')
      });
    }).then(() => {
      return execPromise('git checkout test/sample.js')
    })
  });
  
});