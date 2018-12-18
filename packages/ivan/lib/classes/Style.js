const shortId = require('shortid')

class Style {
  constructor (name, element, children) {
    const className = name + shortId()

    this.name = name
    this.element = element
    this.className = className

    this.children = children

    this.type = 'component'
  }

  render (childBody, props, globals, stylesheet, inject) {
    const tag = this.element
    const attrs = [].concat(props).concat([`class="${this.className}"`]).join(' ')

    const styles = this.children.map(child => {
      const indentation = []
      for (let i = 0; i < child.indentation / 2; i++) {
        indentation.push('  ')
      }

      return `${indentation.join('')}${child.element}: ${child.children}`
    }).join('')
    stylesheet[this.className] = styles

    return `<${tag}${attrs ? ' ' + attrs : ''}>${childBody}</${tag}>`
  }
}

module.exports = Style
