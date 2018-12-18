class Statement {
  constructor (indentation, lineContent, children) {
    this.isRoot = false
    this.indentation = indentation
    this.lineContent = lineContent

    if (lineContent !== 'root') {
      const split = lineContent.replace(/\s{2,}/gi, ' ').replace(/\s:/, ':').replace(/:\s/, '!COMMANDBODYBREAK!').split('!COMMANDBODYBREAK!')
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

  getWithoutFirstCommand () {
    if (this.isRoot) {
      return this
    }

    const lineContent = this.commandArgs.slice(1).join(' ') + (this.commandBody ? ': ' + this.commandBody : '')

    return new Statement(this.indentation, lineContent, this.children)
  }
}

module.exports = Statement
