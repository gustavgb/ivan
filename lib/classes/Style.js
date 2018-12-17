const Element = require('./base/Element.js')

class Style extends Element {
  constructor (el, element, children) {
    super()

    this.name = el
    this.element = element
    this.body = children.map(child => `${child.commandArgs.join(' ')}: ${child.commandBody}`).join('\n')
  }
}

module.exports = Style
