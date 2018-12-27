import '@babel/polyfill'
import compile from './compile'
import nodeWatch from 'node-watch'

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

const main = (sourceDir, { watch = false }) => {
  let timeout = null
  let filesChanged = {}

  if (watch) {
    console.log('Watching for file changes')

    compileWithTime(sourceDir)

    nodeWatch('./' + sourceDir, { recursive: true }, (event, fileName) => {
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
  } else {
    compileWithTime(sourceDir)
  }
}

module.exports = main
