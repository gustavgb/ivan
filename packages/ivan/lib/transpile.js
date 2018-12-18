const Statement = require('./classes/Statement.js')
const Import = require('./classes/Import.js')
const Style = require('./classes/Style.js')
const Layout = require('./classes/Layout.js')
const Page = require('./classes/Page.js')
const Element = require('./classes/Element.js')

const mapChild = (child) => new Element(
  child.commandArgs[0],
  child.commandArgs.slice(1),
  child.commandBody || child.children.map(mapChild)
)

const handleCommand = (statement) => {
  const commandArgs = statement.commandArgs
  const commandBody = statement.commandBody
  const children = statement.children.map(mapChild)

  switch (commandArgs[0]) {
    case 'export': {
      const element = handleCommand(statement.getWithoutFirstCommand())

      element.type = 'export'

      return element
    }
    case 'import': {
      const importType = commandArgs[1]
      const importName = commandArgs[2]

      return new Import(importType, importName)
    }
    case 'style': {
      const componentName = commandArgs[1]

      return new Style(componentName, commandBody, children)
    }
    case 'layout': {
      const name = commandArgs[1]
      const defaultProps = commandArgs.slice(2)

      return new Layout(name, commandBody, defaultProps, children)
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
