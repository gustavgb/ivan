class Element {
  constructor (element, props, body, children, statement) {
    this.element = element
    this.props = props
    this.body = body
    this.children = children
    this.statement = statement
  }

  renderRaw (indentationOffset = 0) {
    const line = this.statement.lineContent

    const indentation = []
    for (let i = 0; i < this.statement.indentation + indentationOffset; i++) {
      indentation.push(' ')
    }

    const children = Array.isArray(this.children) ? '\n' + this.children.map(child => child.renderRaw(indentationOffset)).join('\n') : ''

    return `${indentation.join('')}${line}${children}`
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

      const elementBody = `${body}${inject}`
      let markup

      if (elementBody) {
        markup = `<${tag}${attrs ? ' ' + attrs : ''}>${elementBody}</${tag}>`
      } else {
        markup = `<${tag}${attrs ? ' ' + attrs : ''} />`
      }

      return markup
    }
  }
}

module.exports = Element
