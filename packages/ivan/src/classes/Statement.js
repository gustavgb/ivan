class Statement {
  constructor (indentation, lineContent, parent, children = []) {
    this.indentation = indentation
    this.lineContent = lineContent
    this.parent = parent
    this.children = children

    if (lineContent !== 'root') {
      let body = null
      let bodyArgs = null
      let commandArgs = null
      let inString = false

      for (let i = 0; i < lineContent.length; i++) {
        const c = lineContent[i]
        if (c === '"') {
          inString = !inString
        }

        if (!inString && c === ':') {
          commandArgs = lineContent.substring(0, i).split(' ')
          body = lineContent.substring(i + 1)
          bodyArgs = body.replace(/^\s{1,}/, '').replace(/\s{1,}$/, '').split(' ')

          break
        }
      }

      this.commandArgs = commandArgs || lineContent.split(' ')
      this.body = body || ''
      this.bodyArgs = bodyArgs || ''
    } else {
      this.isRoot = true
    }
  }

  getWithoutFirstCommand () {
    if (this.isRoot) {
      return this
    }

    const lineContent = this.commandArgs.slice(1).join(' ') + (this.body ? ':' + this.body : '')

    return new Statement(this.indentation, lineContent, this.parent, this.children)
  }

  addChild (child) {
    this.children.push(child)
  }
}

export default Statement
