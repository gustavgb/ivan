const Statement = require('./classes/Statement.js')
const Import = require('./classes/Import.js')
const Style = require('./classes/Style.js')
const Layout = require('./classes/Layout.js')

const mapComponentChild = (child) => ({
  element: child.commandArgs[0],
  props: child.commandArgs.slice(1),
  children: child.commandBody || child.children.map(mapComponentChild)
})

const handleCommand = (statement) => {
  const commandArgs = statement.commandArgs
  const commandBody = statement.commandBody
  const children = statement.children

  switch (commandArgs[0]) {
    case 'export': {
      const element = handleCommand(statement.getWithoutFirstCommand())
      element.export = true

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
    case 'layout':
    case 'head':
    case 'body': {
      const name = commandArgs[1]
      const defaultProps = commandArgs.slice(2)
      const componentChildren = children.map(mapComponentChild)

      let el
      switch (commandArgs[0]) {
        case 'layout': el = commandBody; break
        case 'head': el = 'head'; break
        case 'body': el = 'body'; break
      }

      return new Layout(name, el, defaultProps, componentChildren)
    }
    default:
      return null
  }
}

const transpile = (statement) => {
  if (statement instanceof Statement && !statement.isRoot) {
    return handleCommand(statement)
  } else if (statement instanceof Statement) {
    return statement.children.map(transpile)
  } else {
    throw new Error('Invalid statement tree.')
  }
}

module.exports = transpile
