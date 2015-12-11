'use strict'

import { execSync } from 'child_process'
import fs from 'fs'
import j from 'jscodeshift'
import path from 'path'
require('babel-register')({ ignore: false, presets: [ "es2015", "stage-0"] });

module.exports = {
  run: function() {
    let cmd = "find . -type f -print | grep 'node_modules/.*/codemods/.*.js'"
    let results = execSync(cmd).toString()
    results.trim().split('\n').forEach((result) => {
      const migration = require(path.resolve(result))
      if (migration.moduleApiChange) {
        let source = fs.readFileSync(path.resolve(result))
        fs.writeFileSync(`./codemods/${result.split('/').pop()}`, j(source.toString())
          .find(j.Property, { key: {name: "moduleApiChange"}})
          .remove()
          .toSource()
        )
      }
    })
  }
}