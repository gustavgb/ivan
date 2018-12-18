const compile = require('./compile')
const nodeWatch = require('node-watch')

const compileWithTime = (sourceDir) => {
  const begin = Date.now()
  compile(sourceDir)

  const delta = Date.now() - begin

  console.log('Compiled in ' + delta + 'ms')
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
    compile(sourceDir)
  }
}

module.exports = main
