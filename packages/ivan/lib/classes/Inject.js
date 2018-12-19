const renderStylesheet = require('./../renderStylesheet')

class Inject {
  constructor (name, element, defaultProps = [], children) {
    this.name = name
    this.element = element
    this.defaultProps = defaultProps

    this.children = children

    this.type = 'component'
  }

  render (childBody = '', props, globals, stylesheet, inject = '') {
    const tag = this.element
    const attrs = [].concat(props).concat(this.defaultProps).join(' ')

    let body = this.children.map(child => child.renderRaw(-2)).join('\n')

    if (tag === 'style') {
      body = renderStylesheet(body)
    }

    childBody = childBody ? childBody.replace(new RegExp(`^<${tag}>`), '').replace(new RegExp(`</${tag}>$`), '') : ''

    return `<${tag}${attrs ? ' ' + attrs : ''}>\n${body}${childBody}${inject}</${tag}>`
  }
}

module.exports = Inject
