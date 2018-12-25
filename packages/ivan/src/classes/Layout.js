import Component from './../base/Component'

class Layout extends Component {
  constructor (indentation, text, parent, context) {
    super(indentation, text, parent, context)

    this.element = this.bodyArgs[0]
    this.name = this.commandArgs[1]
    this.defaultProps = this.bodyArgs.slice(1)

    this.type = 'component'
  }

  render (globals, stylesheet, childBody = '', props) {
    const components = this.getContextIndex()

    let body = this.children.map(child => child.element === '!children' ? child.element : child.render(globals, stylesheet)).join('').replace('!children', childBody)

    if ((!this.children || this.children.length === 0) && childBody) {
      body = childBody
    }

    const rootComponent = components[this.element]
    if (rootComponent) {
      return rootComponent.render(globals, stylesheet, body, [].concat(this.defaultProps).concat(props))
    }

    const tag = this.element
    const attrs = [].concat(this.defaultProps).concat(props).join(' ')

    if (!tag) {
      return body
    }

    return `<${tag}${attrs ? ' ' + attrs : ''}>${body}</${tag}>`
  }
}

export default Layout
