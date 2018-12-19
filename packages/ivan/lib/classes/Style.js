const shortId = require('shortid')

class Style {
  constructor (name, element, defaultProps = [], children) {
    const className = name + shortId()

    this.name = name
    this.element = element
    this.className = className
    this.defaultProps = defaultProps

    this.children = children

    this.type = 'component'
  }

  render (childBody, props, globals, stylesheet) {
    const tag = this.element
    const attrs = [].concat(props).concat(this.defaultProps).concat([`class="${this.className}"`]).join(' ')

    const styles = this.children.map(child => child.renderRaw()).join('')

    stylesheet[this.className] = styles

    return `<${tag}${attrs ? ' ' + attrs : ''}>${childBody}</${tag}>`
  }
}

module.exports = Style
