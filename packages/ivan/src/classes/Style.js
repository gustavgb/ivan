import shortId from 'shortid'
import Component from './../base/Component'
import { isUpperCase, isVoidElement } from '../utils'

class Style extends Component {
  constructor (options) {
    super(options)

    this.name = this.commandArgs[1]
    const className = this.name + shortId()
    this.element = this.bodyArgs[0]
    this.className = className
    this.defaultProps = this.bodyArgs.slice(1)
  }

  validate (body) {
    if (!isUpperCase(this.name)) {
      throw new Error(`Invalid style component: "${this.text}". Name must start with uppercase letter, was "${this.name}". ${this.identifier}`)
    } else if (isVoidElement(this.element) && body) {
      throw new Error(`Invalid style component: "${this.text}". Is a void element and cannot have children/body. ${this.identifier}`)
    }
  }

  renderRaw (indentation, globals) {
    this.validate()

    return this.children.map(child => child.renderRaw(indentation, globals)).join('\n')
  }

  render (globals, stylesheet, childBody, props) {
    this.validate(childBody)

    const tag = this.element
    const attrs = [].concat(props).concat(this.defaultProps).concat([`class="${this.className}"`]).join(' ')

    const styles = this.children.map(child => child.renderRaw(this.indentation + 2, globals)).join('\n')

    stylesheet[this.className] = styles

    if (!tag) {
      throw new Error('Style component (' + this.name + ') has no tag and therefore cannot be rendered.')
    }

    if (!isVoidElement(this.element)) {
      return `<${tag}${attrs ? ' ' + attrs : ''}>${childBody}</${tag}>`
    } else {
      return `<${tag}${attrs ? ' ' + attrs : ''}>`
    }
  }
}

export default Style
