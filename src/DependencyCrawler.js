'use strict'

import { execSync } from 'child_process'
import fs from 'fs'
import j from 'jscodeshift'
import path from 'path'

module.exports = {
  run: function() {
    let cmd = "find . -type f -print | grep 'node_modules/.*/codemods/.*.js'"
    let results = execSync(cmd).toString()
    results.trim().split('\n').forEach((result) => {
      let isModuleApiChange = false;
      let source = fs.readFileSync(path.resolve(result))
      
      let outputSource = j(source.toString())
        .find(j.Property, { key: {name: "moduleApiChange"}})
        .filter((path) => {
          isModuleApiChange = true;
          return true;
        })
        .remove()
        .toSource()
        
      if (isModuleApiChange) {
        fs.writeFileSync(`./codemods/${result.split('/').pop()}`, outputSource)
      }
    })
  }
}