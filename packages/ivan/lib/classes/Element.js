class Element {
  constructor (element, props, body, children, statement) {
    this.element = element
    this.props = props
    this.body = body
    this.children = children
    this.statement = statement
  }

  renderRaw () {
    const line = this.statement.lineContent

    const indentation = []
    for (let i = 0; i < this.statement.indentation; i++) {
      indentation.push(' ')
    }

    const children = Array.isArray(this.children) ? '\n' + indentation.join('') + this.children.map(child => child.renderRaw()).join('\n') : ''

    return `${line}${children}`
  }

  render (components, globals, stylesheet, inject = '') {
    const component = components[this.element]

    let body = ''
    if (this.body) {
      if (components[this.body]) {
        body = components[this.body].render('', [], globals, stylesheet, inject)
      } else {
        body = this.body
      }
    } else if (Array.isArray(this.children)) {
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
