class Element {
  constructor (element, props, children) {
    this.element = element
    this.props = props
    this.children = children
  }

  render (components, globals, stylesheet, inject = '') {
    const component = components[this.element]

    let body = this.children
    if (Array.isArray(this.children)) {
      body = this.children.map(child => child.render(components, globals, stylesheet)).join('')
    }
    if (component) {
      return component.render(body, this.props, globals, stylesheet, inject)
    } else {
      const attrs = this.props.join(' ')
      const tag = this.element

      const markup = `<${tag}${attrs ? ' ' + attrs : ''}>${body}${inject}</${tag}>`
      return markup
    }
  }
}

module.exports = Element
