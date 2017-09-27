const fs = require('fs')

const { promisify } = require('util')
const readFile = promisify(fs.readFile)

const ifndefRx = /^#ifndef /
const defineRx = /^#define /
const includeRx = /^#include /
const endifRx = /^#endif/

async function namespaceCode(file, namespaces) {
  const src = await readFile(file, 'utf8')
  const lines = src.split('\n')
  // find last '#include' to insert the namespaces right after
  // if no #include is found ensure we don't insert before or in between ifndef/define statements
  var lastInclude = null
  var ifndef = null
  var define = null
  var lastEndif = null
  var i
  for (i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (includeRx.test(line)) {
      lastInclude = i
      continue
    }

    if (ifndef == null && ifndefRx.test(line)) {
      ifndef = i
      continue
    }

    if (ifndef != null && define == null && defineRx.test(line)) {
      define = i
      continue
    }

    if (endifRx.test(line)) lastEndif = i
  }

  const openAfter = (
      lastInclude != null ? lastInclude
    : define != null      ? define
    : 0
  )

  const closeAfter = lastEndif != null ? lastEndif - 1 : lines.length - 1
  const namespacedLines = []
  for (i = 0; i < lines.length; i++) {
    namespacedLines.push(lines[i])
    if (openAfter === i) {
      namespacedLines.push('')
      namespaces.forEach(x => namespacedLines.push(`namespace ${x} {`))
    } else if (closeAfter === i) {
      namespacedLines.push('')
      namespaces.forEach(x => namespacedLines.push('}'))
    }
  }

  return namespacedLines.join('\n')
}

module.exports = namespaceCode
