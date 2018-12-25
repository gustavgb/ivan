import Import from './classes/Import'
import Style from './classes/Style'
import Layout from './classes/Layout'
import Page from './classes/Page'
import Inject from './classes/Inject'
import Component from './base/Component'

class Line {
  constructor (id, indentation, text) {
    this.indentation = indentation
    this.text = text
    this.identifier = id
  }
}

const components = [
  {
    keyword: 'import',
    Component: Import
  },
  {
    keyword: 'inject',
    Component: Inject
  },
  {
    keyword: 'style',
    Component: Style
  },
  {
    keyword: 'layout',
    Component: Layout
  },
  {
    keyword: 'page',
    Component: Page
  }
]

const createComponent = (line, parent, context) => {
  let result
  let { indentation, text, identifier } = line

  if (indentation === 0) {
    const lineContents = text.split(' ')
    let key = lineContents[0]
    let isExport = false

    if (key === 'export') {
      key = lineContents[1]
      text = lineContents.slice(1).join(' ')
      isExport = true
    }

    for (let i = 0; i < components.length; i++) {
      if (new RegExp(`^${components[i].keyword}( |$)`).test(text)) {
        result = new components[i].Component({
          identifier,
          indentation,
          text,
          parent,
          context
        })
        result.isExport = isExport
      }
    }

    if (!result) {
      throw new Error(`Component initiator "${key}" is not valid. ${identifier}`)
    }
  } else {
    result = new Component({
      identifier,
      indentation,
      text,
      parent,
      context
    })
  }

  if (result instanceof Component) {
    return result
  } else if (result) {
    throw new Error(`Parser must return object of type Component when using key "${text.split(' ')[0]}"`)
  }
}

const parse = (raw, src) => {
  const lines = raw.split('\n').map((line, lineNumber) => {
    let indentation = 0
    for (let i = 0; i < line.length; i++) {
      if (line[i] === ' ') {
        indentation++
      } else {
        break
      }
    }

    const identifier = `(${src}:${lineNumber + 1})`

    return new Line(identifier, indentation, line.substr(indentation))
  }).filter(el => !!el.text)

  let root = new Component({ indentation: -1, text: 'root' })
  let head = root

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.indentation > head.indentation) {
      const s = createComponent(line, head, root)
      head.addChild(s)

      head = s
    } else if (line.indentation === head.indentation) {
      const s = createComponent(line, head.parent, root)
      head.parent.addChild(s)

      head = s
    } else {
      while (line.indentation < head.indentation) {
        head = head.parent
      }

      const s = createComponent(line, head.parent, root)

      head.parent.addChild(s)
      head = s
    }
  }

  return root.children
}

export default parse
