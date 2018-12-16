class Style {
  constructor (el, element, children) {
    this.name = el
    this.element = element
    this.body = children.map(child => `${child.commandArgs.join(' ')}: ${child.commandBody}`).join('\n')
  }
}

module.exports = Style
