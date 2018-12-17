const Element = require('./base/Element.js')

class Layout extends Element {
  constructor (name, props, children) {
    super()

    this.element = name
    this.props = props
    this.children = children
  }
}

module.exports = Layout
