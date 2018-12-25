import Statement from './classes/Statement'
import Import from './classes/Import'
import Style from './classes/Style'
import Layout from './classes/Layout'
import Page from './classes/Page'
import Element from './classes/Element'
import Inject from './classes/Inject'
import Component from './classes/Component'

class Line {
  constructor (indentation, content) {
    this.indentation = indentation
    this.content = content
    this.parent = null
  }
}

const splitFile = (raw) => {
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
  }).filter(el => el.content)

  let root = new Statement(-1, 'root')
  let head = root

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.indentation > head.indentation) {
      const s = new Statement(line.indentation, line.content, head)
      head.addChild(s)

      head = s
    } else if (line.indentation === head.indentation) {
      const s = new Statement(line.indentation, line.content, head.parent)
      head.parent.addChild(s)

      head = s
    } else {
      while (line.indentation < head.indentation) {
        head = head.parent
      }

      const s = new Statement(line.indentation, line.content, head.parent)

      head.parent.addChild(s)
      head = s
    }
  }

  return root
}

const mapChild = (child) => new Element(
  child.commandArgs[0],
  child.commandArgs.slice(1),
  child.body,
  child.bodyArgs,
  child.children.map(mapChild),
  child
)

const createComponent = (line, parent) => {
  let result

  if (line.indentation === 0) {

  } else {
    line.parent = parent
    result = line
  }

  return result
}

const handleCommand = (statement) => {
  const commandArgs = statement.commandArgs
  const bodyArgs = statement.bodyArgs
  const children = statement.children.map(mapChild)

  switch (commandArgs[0]) {
    case 'export': {
      const element = handleCommand(statement.getWithoutFirstCommand())

      if (element.type !== 'component') {
        throw new Error('Exports must be components.')
      }

      element.type = 'export'

      return element
    }
    case 'import': {
      const importName = commandArgs[1]

      return new Import(importName, bodyArgs[0])
    }
    case 'inject': {
      const name = commandArgs[1]
      const props = bodyArgs.slice(1)
      const element = bodyArgs[0]

      return new Inject(name, element, props, children)
    }
    case 'style': {
      const componentName = commandArgs[1]
      const props = bodyArgs.slice(1)
      const element = bodyArgs[0]

      return new Style(componentName, element, props, children)
    }
    case 'layout': {
      const name = commandArgs[1]
      const props = bodyArgs.slice(1)
      const element = bodyArgs[0]

      return new Layout(name, element, props, children)
    }
    case 'page': {
      return new Page(children)
    }
    default:
      return null
  }
}

const transpile = (statement) => {
  if (statement instanceof Statement && statement.isRoot) {
    const transpiledFile = statement.children.map(handleCommand)
    transpiledFile.forEach(child => {
      if (child instanceof Layout || child instanceof Page || child instanceof Style) {
        child.file = transpiledFile
      }
    })

    return transpiledFile
  } else {
    throw new Error('Invalid statement tree.')
  }
}

const parse = (file) => {
  const fileContents = splitFile(file)

  return transpile(fileContents)
}

export default parse
