const Element = require('./base/Element.js')

class Style extends Element {
  constructor (name, element, children) {
    super()

    this.name = name
    this.element = element
    this.defaultProps = [`class="${name}"`]
    this.body = children.map(child => `${child.commandArgs.join(' ')}: ${child.commandBody}`).join('\n')
  }
}

module.exports = Style
