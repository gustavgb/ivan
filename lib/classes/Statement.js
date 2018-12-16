class Statement {
  constructor (lineContent, children) {
    this.isRoot = false

    if (lineContent !== 'root') {
      const split = lineContent.replace(/\s{2,}/gi, ' ').replace(' :', ':').replace(': ', ':').split(':')
      const command = split[0]
      const body = split[1]
      const commandArgs = command.split(' ')

      this.commandArgs = commandArgs
      this.commandBody = body
    } else {
      this.isRoot = true
    }

    this.children = children
  }
}

module.exports = Statement
