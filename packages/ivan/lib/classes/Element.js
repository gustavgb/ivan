class Element {
  constructor (element, props, body, bodyArgs, children, statement) {
    this.element = element
    this.props = props
    this.body = body
    this.bodyArgs = bodyArgs
    this.children = children
    this.statement = statement
  }

  renderRaw (indentationOffset = 0, childRenderer) {
    const line = this.statement.lineContent

    const indentation = []
    for (let i = 0; i < this.statement.indentation + indentationOffset; i++) {
      indentation.push(' ')
    }

    let children = ''
    if (Array.isArray(this.children)) {
      if (childRenderer) {
        children = '\n' + this.children.map(childRenderer).join('\n')
      } else {
        children = '\n' + this.children.map(child => child.renderRaw(indentationOffset)).join('\n')
      }
    }

    return `${indentation.join('')}${line}${children}`
  }

  render (components, globals, stylesheet) {
    let body = ''
    const bodyElement = this.bodyArgs[0]
    if (bodyElement) {
      if (this.element && components[bodyElement]) {
        body = components[bodyElement].render('', this.bodyArgs.slice[1], globals, stylesheet)
      } else {
        body = this.body
      }
    } else if (Array.isArray(this.children)) {
      body = this.children.map(child => child.render(components, globals, stylesheet)).join('')
    }

    const component = components[this.element]

    if (component) {
      return component.render(body, this.props, globals, stylesheet)
    } else {
      const attrs = this.props.join(' ')
      const tag = this.element

      let markup

      if (tag) {
        if (body) {
          markup = `<${tag}${attrs ? ' ' + attrs : ''}>${body}</${tag}>`
        } else {
          markup = `<${tag}${attrs ? ' ' + attrs : ''} />`
        }
      } else {
        markup = body
      }

      return markup
    }
  }
}

module.exports = Element
