import { isUpperCase, isVoidElement } from '../utils'
import marked from 'marked'

class Component {
  constructor ({ identifier, indentation, text = '', parent = null, context = null, children = [] }) {
    this.indentation = indentation
    this.identifier = identifier
    this.text = text
    this.parent = parent
    this.children = children
    this.context = context

    this.name = null

    if (text !== 'root') {
      let body = null
      let bodyArgs = null
      let commandArgs = null
      let inString = false

      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (c === '"') {
          inString = !inString
        }

        if (!inString && c === ':') {
          commandArgs = text.substring(0, i).split(' ')
          body = text.substring(i + 1)
          bodyArgs = body.replace(/^\s{1,}/, '').replace(/\s{1,}$/, '').split(' ')

          break
        }
      }

      this.commandArgs = commandArgs || text.split(' ')
      this.body = body || ''
      this.bodyArgs = bodyArgs || []
    } else {
      this.isRoot = true
    }
  }

  addChild (child) {
    this.children.push(child)
  }

  getContextIndex () {
    return this.context.children.filter(a => !!a.name && !a.entry).reduce((acc, el) => Object.assign(acc, { [el.name]: el }), {})
  }

  validate (components, overrideBody) {
    if (isUpperCase(this.text) && !components[this.commandArgs[0]]) {
      throw new Error(`Component "${this.commandArgs[0]}" is not defined. You might have forgotten to import the appropiate component the appropiate component. ${this.identifier}`)
    } else if (this.body && this.children.length > 0) {
      throw new Error(`Component "${this.commandArgs[0]}" is not valid. Cannot have both component body and children. Choose one or the other. ${this.identifier}`)
    } else if (this.commandArgs[0] === '!children' && this.children.length > 0) {
      throw new Error(`Component "${this.commandArgs[0]}" is not valid. Cannot have children/body. ${this.identifier}`)
    } else if (isVoidElement(this.commandArgs[0]) && (this.children.length > 0 || this.body || overrideBody)) {
      throw new Error(`Component "${this.commandArgs[0]}" is a void element and cannot have children/body. ${this.identifier}`)
    }
  }

  renderBody () {
    return marked(
      this.body
        .replace(/\s{2,}/, (match) => match.replace(/\s/g, '&nbsp;'))
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\\n/g, '<br>')
    ).replace(/^<p>/, '').replace(/<\/p>\n/, '\n')
  }

  renderRaw (indentation, globals) {
    const components = this.getContextIndex()

    if (components[this.text]) {
      return components[this.text].renderRaw(indentation, globals)
    }

    let children = ''
    if (Array.isArray(this.children)) {
      children = '\n' + this.children.map(child => child.renderRaw(indentation + 2, globals)).join('\n')
    }

    if (isNaN(indentation)) {
      indentation = this.indentation
    }

    const indentationText = []
    for (let i = 0; i < indentation; i++) {
      indentationText.push(' ')
    }

    return `${indentationText.join('')}${this.text}${children}`
  }

  render (globals, stylesheet, overrideBody, extraProps) {
    const components = this.getContextIndex()

    this.validate(components, overrideBody)

    let body = ''
    const element = this.commandArgs[0]
    const props = this.commandArgs.slice(1).concat(extraProps)
    const bodyElement = this.bodyArgs[0]

    if (element === '!children') {
      body = element
    } else if (overrideBody) {
      body = overrideBody
    } else if (bodyElement) {
      if (element && components[bodyElement]) {
        body = components[bodyElement].render(globals, stylesheet, '', props)
      } else {
        body = this.renderBody()
      }
    } else if (Array.isArray(this.children)) {
      body = this.children.map(child => child.render(globals, stylesheet)).join('')
    }

    const component = components[element]

    if (component) {
      return component.render(globals, stylesheet, body, props)
    } else {
      const attrs = props.join(' ')
      const tag = element

      let markup

      if (tag && tag !== '!children') {
        if (isVoidElement(element)) {
          markup = `<${tag}${attrs ? ' ' + attrs : ''}>`
        } else {
          markup = `<${tag}${attrs ? ' ' + attrs : ''}>${body}</${tag}>`
        }
      } else {
        markup = body
      }

      return markup
    }
  }
}

export default Component
