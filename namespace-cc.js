#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const { promisify } = require('util')
const readdir = promisify(fs.readdir)
const access = promisify(fs.access)
const stat = promisify(fs.stat)
const writeFile = promisify(fs.writeFile)

const namespaceCode = require('./lib/namespace-code')

const extsRx = /\.(h|hpp|cc|cpp)/i

async function canAccess(p) {
  try {
    await access(p)
    return true
  } catch (e) {
    return false
  }
}

async function isFile(p) {
  const s = await stat(p)
  return s.isFile()
}

async function namespacedSources(dir, namespaces) {
  const fileNames = await readdir(dir)
  const files = fileNames
    .filter(x => extsRx.test(x))
    .map(x => path.join(dir, x))
    .filter(async x => await canAccess(x))
    .filter(async x => await isFile(x))

  const map = new Map()
  for (var i = 0; i < files.length; i++) {
    const file = files[i]
    const namespaced = await namespaceCode(file, namespaces)
    map.set(file, namespaced)
  }
  return map
}

async function writeOutNamespaced(map) {
  for (const [ file, src ] of map) {
    await writeFile(file, src, 'utf8')
  }
}

/**
 * Namespaces all C++ files in the given directory.
 * The files will be overwritten in place.
 *
 * @name namespaceDirectory
 * @function
 * @param {string} dir the directory to process
 * @param {Array.<string>} namespaces the namespaces to enclose the definitions in,
 *                        i.e. `[ 'outer', 'inner' ]`
 */
async function namespaceDirectory(dir, namespaces) {
  const namespaced = await namespacedSources(dir, namespaces)
  await writeOutNamespaced(namespaced)
}

module.exports = namespaceDirectory

// CLI

function printUsage() {
  console.error(`Usage: namespace-cc <full-path-to-dir> '<space-separated-namespaced>'`)
}

if (!module.parent && typeof window === 'undefined') {
(async function() {
  const args = process.argv.slice(2)
  if (args.length !== 2) {
    printUsage()
    process.exit(1)
  }
  const dir = args[0]
  try {
    fs.accessSync(dir)
  } catch (e) {
    console.error(`Cannot access '${dir}'`)
    printUsage()
    process.exit(1)
  }

  const namespaces = args[1].split(' ')
  if (namespaces.length === 0) {
    console.error('Yoy need to provide at least one namespace')
    printUsage()
    process.exit(1)
  }

  await namespaceDirectory(dir, namespaces)
})()
}
