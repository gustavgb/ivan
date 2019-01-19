import Component from './../base/Component'
import { isUpperCase } from '../utils'

class Layout extends Component {
  constructor (options) {
    super(options)

    this.element = this.bodyArgs[0]
    this.name = this.commandArgs[1]
    this.defaultProps = this.bodyArgs.slice(1)
  }

  validate () {
    if (!isUpperCase(this.name)) {
      throw new Error(`Invalid layout component: "${this.text}". Name must start with uppercase letter, was "${this.name}". ${this.identifier}`)
    }
  }

  renderRaw (indentation, globals) {
    return this.children.map(child => child.renderRaw(indentation, globals)).join('\n')
  }

  render (globals, stylesheet, childBody = '', props) {
    const components = this.getContextIndex()

    this.validate(components)

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
