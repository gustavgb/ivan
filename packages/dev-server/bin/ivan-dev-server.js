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

flags.src = flags.src || flags.s
flags.port = flags.port || flags.p

if (!flags.src) {
  console.warn('Please provide entry source folder with the --src flag')
  process.exit(1)
}

const sourceDir = flags.src.replace(/\/$/gi, '')

compiler(sourceDir, flags.port)
