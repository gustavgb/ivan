import Component from './../base/Component'
import { isUpperCase } from '../utils'

class Import extends Component {
  constructor (options) {
    super(options)

    this.componentName = this.commandArgs[1]
    this.name = this.bodyArgs[0] || this.componentName
  }

  validate (component) {
    if (!isUpperCase(this.name)) {
      throw new Error(`Invalid import component: "${this.text}". Name must start with uppercase letter, was "${this.name}". ${this.identifier}`)
    } else if (!isUpperCase(this.componentName)) {
      throw new Error(`Invalid import component: "${this.text}". Component name must start with uppercase letter, was "${this.componentName}". ${this.identifier}`)
    } else if (this.commandArgs.length !== 2) {
      throw new Error(`Invalid import component: "${this.text}". Found either too many or too few arguments. Usage: "import Foo: Bar" ${this.identifier}`)
    } else if (this.bodyArgs.length > 1) {
      throw new Error(`Invalid import component: "${this.text}". Component body too long. Usage: "import Foo: Bar" ${this.identifier}`)
    } else if (this.children.length > 0) {
      throw new Error(`Invalid import component: "${this.text}". Import components cannot have children. Usage: "import Foo: Bar" ${this.identifier}`)
    } else if (!component) {
      throw new Error(`Export ${this.componentName} not found. You might have forgotten to export the appropiate component. ${this.identifier}`)
    }
  }

  renderRaw (indentation, globals) {
    const component = globals.filter(a => a.name === this.componentName)[0]

    this.validate(component)

    return component.renderRaw(indentation, globals)
  }

  render (globals, stylesheet, childBody, props) {
    const component = globals.filter(a => a.name === this.componentName)[0]

    this.validate(component)

    return component.render(globals, stylesheet, childBody, props)
  }
}

export default Import
