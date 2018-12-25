import Component from './../base/Component'
import renderStylesheet from './../renderStylesheet'

class Inject extends Component {
  constructor (indentation, text, parent, context) {
    super(indentation, text, parent, context)

    this.name = this.commandArgs[1]
    this.element = this.bodyArgs[0]
    this.defaultProps = this.bodyArgs.slice(1)

    this.type = 'component'
  }

  render (childBody = '', props, globals, stylesheet) {
    const tag = this.element
    const attrs = [].concat(props).concat(this.defaultProps).join(' ')

    let body = this.children.map(child => child.renderRaw(-2)).join('\n')

    if (tag === 'style') {
      body = renderStylesheet(body)
    }

    childBody = childBody ? childBody.replace(new RegExp(`^<${tag}>`), '').replace(new RegExp(`</${tag}>$`), '') : ''

    return `<${tag}${attrs ? ' ' + attrs : ''}>\n${body}${childBody}</${tag}>`
  }
}

export default Inject
