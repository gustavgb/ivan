#! /usr/bin/env node

const compiler = require('../index')

const flags = process.argv.slice(2).join(' ').replace(/--/gi, '-').split('-').reduce((acc, flag) => {
  const key = flag.split(' ')[0]
  const value = flag.split(' ')[1] || true
  if (key) {
    return Object.assign(acc, { [key]: value })
  } else {
    return acc
  }
}, {})

flags.port = flags.port || flags.p
flags.src = flags.src || flags.s || 'src'
const sourceDir = flags.src.replace(/\/$/gi, '')

switch (process.argv[2]) {
  case 'help':
  case '--help': {
    console.log('Usage: ivan-dev-server [--src /path/to/src]\n')
    break
  }
  default:
    compiler(sourceDir, flags.port)
}
