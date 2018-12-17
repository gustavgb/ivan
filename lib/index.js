const watch = require('node-watch')
const compile = require('./compile.js')
const loghandler = require('./loghandler.js')

const flags = process.argv.join(' ').replace(/--/gi, '-').split('-').reduce((acc, flag) => {
  const key = flag.split(' ')[0]
  const value = flag.split(' ')[1] || true
  return Object.assign(acc, { [key]: value })
}, {})

if (!flags.s) {
  console.warn('Please provide entry source folder with the -s flag')
  process.exit(1)
}

const sourceDir = flags.s.replace(/\/$/gi, '')

const mode = flags.watch ? 'watch' : 'build'

const compileWithTime = () => {
  const begin = Date.now()
  compile(sourceDir)

  const delta = Date.now() - begin

  console.log('Compiled in ' + delta + 'ms')
}

let timeout = null
const filesChanged = []

if (mode === 'watch') {
  console.log('Watching for file changes')

  compileWithTime()

  watch('./' + sourceDir, { recursive: true }, (event, fileName) => {
    filesChanged.push(fileName)

    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null

        console.log('\nFiles changed: \n  - ' + filesChanged.join('\n  - '))

        compileWithTime()
      }, 300)
    }
  })
} else {
  compile(sourceDir)

  loghandler.writeLogs()
}
