import Component from './../base/Component'
import renderStylesheet from './../renderStylesheet'
import { isUpperCase } from '../utils'

class Inject extends Component {
  constructor (options) {
    super(options)

    this.name = this.commandArgs[1]
    this.element = this.bodyArgs[0]
    this.defaultProps = this.bodyArgs.slice(1)
  }

  validate (props, childBody) {
    if (!isUpperCase(this.name)) {
      throw new Error(`Invalid inject component: "${this.text}". Name must start with uppercase letter, was "${this.name}". ${this.identifier}`)
    } else if (this.children.length === 0 && this.defaultProps.length === 0 && props.length === 0 && childBody.length === 0) {
      throw new Error(`Invalid Inject component: "${this.text}". Useless, when no children or attributes present on component. ${this.identifier}`)
    } else if (this.commandArgs.length !== 2) {
      throw new Error(`Invalid Inject component: "${this.text}". Found either too many or too few arguments. Usage: "inject Foo: bar [prop1[, prop2...]]" ${this.identifier}`)
    }
  }

  renderRaw (indentation, globals) {
    this.validate([], '')

    return this.children.map(child => child.renderRaw(indentation, globals)).join('\n')
  }

  render (globals, stylesheet, childBody = '', props) {
    this.validate(props, childBody)

    const tag = this.element
    const attrs = [].concat(props).concat(this.defaultProps).join(' ')

    let body = this.children.map(child => child.renderRaw(0, globals)).join('\n')

    if (tag === 'style') {
      body = renderStylesheet(body)
    }

    childBody = childBody ? childBody.replace(new RegExp(`^<${tag}>`), '').replace(new RegExp(`</${tag}>$`), '') : ''

    return `<${tag}${attrs ? ' ' + attrs : ''}>\n${body}${childBody}</${tag}>`
  }
}

export default Inject
