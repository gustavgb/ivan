const fs = require('fs')

class LogHandler {
  constructor () {
    this.logs = []
  }

  log (msg) {
    this.logs.push(`Log at time ${new Date(Date.now()).toISOString()}:\n\n${msg}`)
  }

  writeLogs () {
    fs.writeFileSync('log.json', this.logs.join('\n\n'))
  }
}

module.exports = new LogHandler()
