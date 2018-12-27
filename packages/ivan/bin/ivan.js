#! /usr/bin/env node

const run = require('./../lib/index')

const flags = process.argv.slice(3).join(' ').replace(/--/gi, '-').split('-').reduce((acc, flag) => {
  const key = flag.split(' ')[0]
  const value = flag.split(' ')[1] || true
  if (key) {
    return Object.assign(acc, { [key]: value })
  } else {
    return acc
  }
}, {})

flags.src = flags.src || flags.s || 'src'
const sourceDir = flags.src.replace(/\/$/gi, '')

switch (process.argv[2]) {
  case 'build':
    run({ src: sourceDir })
    break
  case 'watch':
    run({ src: sourceDir, watch: true })
    break
  case 'help':
  case '--help': {
    console.log('Usage: ivan <command> [--src /path/to/src]\n\nValid commands are:\n  - build: Tells the compiler to build the source directory once.\n  - watch: Tells the compiler to build the source directory once immediately and then watch the directory for file changes.\n')
    break
  }
  default:
    console.error('Argument "' + process.argv[2] + '" is not valid. Use either "build" or "watch"')
    process.exit(1)
}
