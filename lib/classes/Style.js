const Element = require('./base/Element.js')
const shortId = require('shortid')

class Style extends Element {
  constructor (name, element, children) {
    super()

    const className = name + shortId()

    this.name = name
    this.element = element
    this.defaultProps = [`class="${className}"`]
    this.className = className

    this.styles = children.map(child => {
      const indentation = []
      for (let i = 0; i < child.indentation / 2; i++) {
        indentation.push('  ')
      }

      return `${indentation.join('')}${child.commandArgs.join(' ')}: ${child.commandBody}`
    }).join('\n')
  }
}

module.exports = Style
