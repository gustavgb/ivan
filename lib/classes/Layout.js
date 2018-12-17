const Element = require('./base/Element.js')

const mapChild = (child) => ({
  element: child.commandArgs[0],
  props: child.commandArgs.slice(1),
  children: child.commandBody || child.children.map(mapChild)
})

class Layout extends Element {
  constructor (name, element, props, children) {
    super()

    this.element = element
    this.name = name
    this.defaultProps = props
    this.children = children.map(mapChild)
  }
}

module.exports = Layout
