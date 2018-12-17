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
    this.styles = children.map(child => `${child.commandArgs.join(' ')}: ${child.commandBody}`).join('\n')
  }
}

module.exports = Style
