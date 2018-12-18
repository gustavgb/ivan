const collectComponentIndex = require('./../collectComponents')

class Layout {
  constructor (name, element, props, children) {
    this.element = element
    this.name = name
    this.defaultProps = props
    this.children = children
    this.file = null

    this.type = 'component'
  }

  render (childBody = '', props, globals, stylesheet, inject = '') {
    const components = collectComponentIndex(this.file, globals)

    let body = this.children.map(child => child.element === '!children' ? child.element : child.render(components, globals, stylesheet)).join('').replace('!children', childBody)

    if ((!this.children || this.children.length === 0) && childBody) {
      body = childBody
    }

    const rootComponent = components[this.element]
    if (rootComponent) {
      return rootComponent.render(body, [].concat(this.defaultProps).concat(props), globals, stylesheet, inject)
    }

    const tag = this.element
    const attrs = [].concat(this.defaultProps).concat(props).join(' ')

    return `<${tag}${attrs ? ' ' + attrs : ''}>${body}${inject}</${tag}>`
  }
}

module.exports = Layout
