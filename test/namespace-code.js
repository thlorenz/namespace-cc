const test = require('tape')
const namespaceCode = require('../lib/namespace-code')

const path = require('path')
const fs = require('fs')
const fixtures = path.join(__dirname, 'fixtures')

async function check(t, sourceFile, resultFile) {
  const sourcePath = path.join(fixtures, 'header.h')
  const resultPath = path.join(fixtures, 'header.namespaced.h')

  const namespaces = [ 'impeach', 'trump' ]
  const code = await namespaceCode(sourcePath, namespaces)
  t.equal(code, fs.readFileSync(resultPath, 'utf8'))
  t.end()
}

test('\nheader file with includes', function(t) {
  check(t, 'header.h', 'header.namespaced.h')
})

test('\nheader file without includes', function(t) {
  check(t, 'header-no-include.h', 'header-no-include.namespaced.h')
})

test('\ncc file with includes', function(t) {
  check(t, 'source.cc', 'source.namespaced.cc')
})
