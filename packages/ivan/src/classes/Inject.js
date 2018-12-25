import Component from './../base/Component'
import renderStylesheet from './../renderStylesheet'

class Inject extends Component {
  constructor (options) {
    super(options)

    this.name = this.commandArgs[1]
    this.element = this.bodyArgs[0]
    this.defaultProps = this.bodyArgs.slice(1)
  }

  validate () {
    if (this.children.length === 0) {
      throw new Error(`Invalid Inject component: "${this.text}". Inject components must have children. ${this.identifier}`)
    } else if (this.commandArgs.length !== 2) {
      throw new Error(`Invalid Inject component: "${this.text}". Found either too many or too few arguments. Usage: "inject Foo: bar [prop1[, prop2...]]" ${this.identifier}`)
    }
  }

  renderRaw (indentation, globals) {
    return this.children.map(child => child.renderRaw(indentation, globals)).join('\n')
  }

  render (globals, stylesheet, childBody = '', props) {
    this.validate()

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
