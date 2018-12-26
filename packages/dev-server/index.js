const compiler = require('@gustavgb/ivan')
const http = require('http')
const fs = require('fs')
const path = require('path')

const requestHandler = (request, response) => {
  var filePath = 'dist' + request.url
  if (filePath === 'dist/') {
    filePath = 'dist/index.html'
  }

  var extname = path.extname(filePath)
  var contentType = 'text/html'
  switch (extname) {
    case '.js':
      contentType = 'text/javascript'
      break
    case '.css':
      contentType = 'text/css'
      break
    case '.json':
      contentType = 'application/json'
      break
    case '.png':
      contentType = 'image/png'
      break
    case '.jpg':
      contentType = 'image/jpg'
      break
    case '.wav':
      contentType = 'audio/wav'
      break
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('dist/404.html', (error, content) => {
          if (error) {
            response.writeHead(200, { 'Content-Type': 'text/plain' })
            response.write('No such file, open ' + filePath.replace(/^dist/, ''))
            response.end()
          } else {
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.end(content, 'utf-8')
          }
        })
      } else {
        response.writeHead(500)
        response.end('An error occured: ' + error.code + ' ..\n')
        response.end()
      }
    } else {
      response.writeHead(200, { 'Content-Type': contentType })
      response.end(content, 'utf-8')
    }
  })
}

const startWatcher = (sourceDir) => {
  compiler(sourceDir, { watch: true })
}

module.exports = (sourceDir, port = 3000) => {
  const server = http.createServer(requestHandler)

  server.listen(port, (err) => {
    if (err) {
      return console.log('Development server failed with error: ', err)
    }

    console.log(`Development server is listening on port ${port}\n`)
    startWatcher(sourceDir)
  })
}
