import shortId from 'shortid'
import Component from './../base/Component'

class Style extends Component {
  constructor (indentation, text, parent, context) {
    super(indentation, text, parent, context)

    this.name = this.commandArgs[1]
    const className = this.name + shortId()
    this.element = this.bodyArgs[0]
    this.className = className
    this.defaultProps = this.bodyArgs.slice(1)
  }

  renderRaw (indentation, globals) {
    return this.children.map(child => child.renderRaw(indentation, globals)).join('\n')
  }

  render (globals, stylesheet, childBody, props) {
    const tag = this.element
    const attrs = [].concat(props).concat(this.defaultProps).concat([`class="${this.className}"`]).join(' ')

    const styles = this.children.map(child => child.renderRaw(this.indentation + 2, globals)).join('\n')

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

export default Style
