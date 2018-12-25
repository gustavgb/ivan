import Component from './../base/Component'

class Import extends Component {
  constructor (indentation, text, parent, context) {
    super(indentation, text, parent, context)

    this.componentName = this.commandArgs[1]
    this.name = this.bodyArgs[0] || this.componentName

    this.type = 'import'
  }

  render (globals, stylesheet, childBody, props) {
    const component = globals.filter(a => a.name === this.componentName)[0]

    if (component) {
      return component.render(globals, stylesheet, childBody, props)
    } else {
      throw new Error(`Export ${this.componentName} not found`)
    }
  }
}

export default Import
