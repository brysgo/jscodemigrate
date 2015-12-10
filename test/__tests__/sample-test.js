'use strict';

import promisify from 'promisify-node'
import { exec } from 'child_process'
let execPromise = promisify(exec)

describe('running code migrations', () => {

  pit('runs all the migrations on the sample file', () => {
    return Promise.resolve().then(() => { // Make sure our test file is clean
      return execPromise('git checkout test/sample.js');
    }).then(() => { // Run code migrations
      return execPromise('jscodemigrate run');
    }).then(() => { // Check that our modified code matches what we expected
      return execPromise('diff test/sample.js test/sample.expected.js').then((stdout) => {
        expect(stdout).toEqual('')
      });
    }).then(() => { // Test if migrations need to be run
      return execPromise('jscodemigrate test').then((stdout) => {
        expect(stdout).toContain('1 unmodifed')
        expect(stdout).toContain('0 ok')
      })
    }).then(() => { // Clean up
      return execPromise('git checkout test/sample.js')
    })
  });
  
});