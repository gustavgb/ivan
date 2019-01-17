import '@babel/polyfill'
import compile from './compile'
import nodeWatch from 'node-watch'

let watcher
let filesChanged = {}
let timeout = null

const openWatcher = (sourceDir) => {
  watcher = nodeWatch('./' + sourceDir, { recursive: true })

  watcher.on('error', console.error)
  watcher.on('change', (evt, fileName) => {
    if (evt === 'remove') {
      watcher.close()

      openWatcher(sourceDir)
    }

    filesChanged[fileName] = true

    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null

        console.log('\nFiles changed: \n  - ' + Object.keys(filesChanged).join('\n  - '))

        filesChanged = {}

        compileWithTime(sourceDir)
      }, 300)
    }
  })
}

const compileWithTime = (sourceDir) => {
  const begin = Date.now()
  compile(sourceDir)
    .then(() => {
      const delta = Date.now() - begin

      console.log('Compiled in ' + delta + 'ms')

      return null
    })
    .catch(console.error)
}

const main = ({ src: sourceDir, watch = false }) => {
  if (watch) {
    console.log('Watching for file changes')

    compileWithTime(sourceDir)

    openWatcher(sourceDir)
  } else {
    compileWithTime(sourceDir)
  }
}

module.exports = main
