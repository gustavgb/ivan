const Statement = require('./classes/Statement')
const Import = require('./classes/Import')
const Style = require('./classes/Style')
const Layout = require('./classes/Layout')
const Page = require('./classes/Page')
const Element = require('./classes/Element')
const Inject = require('./classes/Inject')

const mapChild = (child) => new Element(
  child.commandArgs[0],
  child.commandArgs.slice(1),
  child.body,
  child.bodyArgs,
  child.children.map(mapChild),
  child
)

const handleCommand = (statement) => {
  const commandArgs = statement.commandArgs
  const bodyArgs = statement.bodyArgs
  const children = statement.children.map(mapChild)

  switch (commandArgs[0]) {
    case 'export': {
      const element = handleCommand(statement.getWithoutFirstCommand())

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
      if (child instanceof Layout || child instanceof Page) {
        child.file = transpiledFile
      }
    })

    return transpiledFile
  } else {
    throw new Error('Invalid statement tree.')
  }
}

module.exports = transpile
