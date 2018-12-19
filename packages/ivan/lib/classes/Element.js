class Element {
  constructor (element, props, body, bodyArgs, children, statement) {
    this.element = element
    this.props = props
    this.body = body
    this.bodyArgs = bodyArgs
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
    let body = ''
    const bodyElement = this.bodyArgs[0]
    if (bodyElement) {
      if (this.element && components[bodyElement]) {
        body = components[bodyElement].render('', this.bodyArgs.slice[1], globals, stylesheet, inject)
      } else {
        body = this.body
      }
    } else if (Array.isArray(this.children)) {
      body = this.children.map(child => child.render(components, globals, stylesheet)).join('')
    }

    const component = components[this.element]

    if (component) {
      return component.render(body, this.props, globals, stylesheet, inject)
    } else {
      const attrs = this.props.join(' ')
      const tag = this.element

      const elementBody = `${body}${inject}`
      let markup

      if (tag) {
        if (elementBody) {
          markup = `<${tag}${attrs ? ' ' + attrs : ''}>${elementBody}</${tag}>`
        } else {
          markup = `<${tag}${attrs ? ' ' + attrs : ''} />`
        }
      } else {
        markup = elementBody
      }

      return markup
    }
  }
}

module.exports = Element
