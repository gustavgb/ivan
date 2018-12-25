import Import from './classes/Import'
import Style from './classes/Style'
import Layout from './classes/Layout'
import Page from './classes/Page'
import Inject from './classes/Inject'
import Component from './base/Component'

class Line {
  constructor (indentation, text) {
    this.indentation = indentation
    this.text = text
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

const createComponent = (indentation, text, parent, context) => {
  let result

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
        result = new components[i].Component(indentation, text, parent, context)
        result.isExport = isExport
      }
    }
  } else {
    result = new Component(indentation, text, parent, context)
  }

  if (result instanceof Component) {
    return result
  } else {
    throw new Error('Parser must return object of type Component.')
  }
}

const parse = (raw) => {
  const lines = raw.split('\n').map(line => {
    let indentation = 0
    for (let i = 0; i < line.length; i++) {
      if (line[i] === ' ') {
        indentation++
      } else {
        break
      }
    }

    return new Line(indentation, line.substr(indentation))
  }).filter(el => !!el.text)

  let root = new Component(-1, 'root')
  let head = root

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.indentation > head.indentation) {
      const s = createComponent(line.indentation, line.text, head, root)
      head.addChild(s)

      head = s
    } else if (line.indentation === head.indentation) {
      const s = createComponent(line.indentation, line.text, head.parent, root)
      head.parent.addChild(s)

      head = s
    } else {
      while (line.indentation < head.indentation) {
        head = head.parent
      }

      const s = createComponent(line.indentation, line.text, head.parent, root)

      head.parent.addChild(s)
      head = s
    }
  }

  return root.children
}

export default parse
