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

    const body = this.children.map(child => child.renderRaw()).join('\n')

    childBody = childBody ? childBody.replace(new RegExp(`^<${tag}>`), '').replace(new RegExp(`</${tag}>$`), '') : ''

    return `<${tag}${attrs ? ' ' + attrs : ''}>\n${body}${childBody}${inject}</${tag}>`
  }
}

module.exports = Inject
