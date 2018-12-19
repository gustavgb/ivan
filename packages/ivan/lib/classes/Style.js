const shortId = require('shortid')
const collectComponentIndex = require('./../collectComponents')

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

  renderStyles (globals) {
    const components = collectComponentIndex(this.file, globals)

    return this.children.map(child => {
      if (components[child.element] instanceof Style) {
        return components[child.element].renderStyles(globals)
      } else {
        return child.renderRaw()
      }
    }).join('')
  }

  render (childBody, props, globals, stylesheet) {
    const tag = this.element
    const attrs = [].concat(props).concat(this.defaultProps).concat([`class="${this.className}"`]).join(' ')

    const styles = this.renderStyles(globals)

    stylesheet[this.className] = styles

    if (!tag) {
      throw new Error('Style component (' + this.name + ') has no tag and therefore cannot be rendered.')
    }

    if (childBody) {
      return `<${tag}${attrs ? ' ' + attrs : ''}>${childBody}</${tag}>`
    }

    return `<${tag}${attrs ? ' ' + attrs : ''} />`
  }
}

module.exports = Style
