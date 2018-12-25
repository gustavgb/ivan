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

    this.type = 'component'
  }

  renderChild (child, indentationOffset, components, globals) {
    const element = child.commandArgs[0]

    if (components[element] instanceof Style) {
      return components[element].renderStyles(globals, child.indentation + indentationOffset)
    } else {
      return child.renderRaw(indentationOffset, (grandchild) => this.renderChild(grandchild, indentationOffset, components, globals))
    }
  }

  renderStyles (globals, parentIndentation = 0) {
    const components = this.getContextIndex()

    return this.children.map(child => this.renderChild(child, parentIndentation - child.indentation, components, globals)).join('\n')
  }

  render (globals, stylesheet, childBody, props) {
    const tag = this.element
    const attrs = [].concat(props).concat(this.defaultProps).concat([`class="${this.className}"`]).join(' ')

    const styles = this.renderStyles(globals, 2)

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
