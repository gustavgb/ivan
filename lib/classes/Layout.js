const Element = require('./base/Element.js')

class Layout extends Element {
  constructor (name, element, props, children) {
    super()

    this.element = element
    this.name = name
    this.defaultProps = props
    this.children = children
  }
}

module.exports = Layout
