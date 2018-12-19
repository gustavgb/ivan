class Statement {
  constructor (indentation, lineContent, children) {
    this.indentation = indentation
    this.lineContent = lineContent

    if (lineContent !== 'root') {
      let bodyBreakIndex = null
      let inString = false

      for (let i = 0; i < lineContent.length; i++) {
        const c = lineContent[i]
        if (c === '"') {
          inString = !inString
        }

        if (!inString && c === ':') {
          bodyBreakIndex = i
          break
        }
      }

      if (bodyBreakIndex) {
        const commandArgs = lineContent.substring(0, bodyBreakIndex).split(' ')
        const body = lineContent.substring(bodyBreakIndex + 1).replace(/^\s{1,}/, '').replace(/\s{1,}$/, '')

        console.log(commandArgs, body)

        this.commandArgs = commandArgs
        this.commandBody = body
      } else {
        this.commandArgs = lineContent.split(' ')
        this.commandBody = ''
      }
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
