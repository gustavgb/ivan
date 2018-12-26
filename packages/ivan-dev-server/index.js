const compiler = require('@gustavgb/ivan')
const http = require('http')
const handler = require('serve-handler')

const startWatcher = (sourceDir) => {
  compiler(sourceDir, { watch: true })
}

module.exports = (sourceDir, port = 3000) => {
  const server = http.createServer((req, res) => {
    return handler(req, res, {
      public: 'dist'
    })
  })

  server.listen(port, (err) => {
    if (err) {
      return console.log('Development server failed with error: ', err)
    }

    console.log(`Development server is listening on port ${port}\n`)
    startWatcher(sourceDir)
  })
}
