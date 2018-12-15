const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')

fs.emptyDirSync(path.join(__dirname, 'dist'))

glob('pages/*.ivan', {}, (err, files) => {
  if (err) {
    throw err
  }

  console.log(files)

  processFiles(files)
})

const section = (indent, content, parent = null) => ({
  indent: indent,
  content: content,
  parent: parent,
  children: []
})

const removeExcess = (section) => {
  if (section.children.length === 0) {
    return {
      content: section.content
    }
  } else {
    return {
      content: section.content,
      children: section.children.map(removeExcess)
    }
  }
}

const deepenStructure = (lines) => {
  let root = section(-1, 'root')
  let head = root

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.indent > head.indent) {
      const s = section(line.indent, line.content, head)
      head.children.push(s)

      head = s
    } else if (line.indent === head.indent) {
      head.parent.children.push(section(line.indent, line.content, head.parent))
    } else {
      while (line.indent < head.indent) {
        head = head.parent
      }

      const s = section(line.indent, line.content, head.parent)

      head.parent.children.push(s)
      head = s
    }
  }

  return removeExcess(root).children
}

const compileComponent = (component) => {
  const styles = component.children.map(child => child.content).join('')
  const command = component.content.replace(/^component /, '').replace(/ /gi, '').split(':')
  return {
    name: command[0],
    element: command[1],
    className: command[0].toLowerCase(),
    styles
  }
}

const compileElementTree = (tree, components) => {
  const split = tree.content.replace(': ', ':').split(':')
  const commandSplit = split[0].split(' ')
  const name = commandSplit[0]
  let props = commandSplit.slice(1)
  let el = name

  if (components[name]) {
    el = components[name].element
    props.push(`class="${components[name].className}"`)
  }

  let body = split[1]

  if (!body && tree.children) {
    body = tree.children.map(tree => compileElementTree(tree, components)).join('')
  } else if (!body) {
    body = ''
  }

  return `<${el}${props.length ? ' ' + props.join(' ') : ''}>${body}</${el}>`
}

const createElements = (raw) => {
  const lines = raw.split('\n').map(line => {
    let indent = 0
    for (let i = 0; i < line.length; i++) {
      if (line[i] === ' ') {
        indent++
      } else {
        break
      }
    }

    const el = {
      indent,
      content: line.substr(indent)
    }

    return el
  }).filter(el => el.content)

  const root = deepenStructure(lines)

  const elementTrees = []
  const components = []

  root.forEach((element, index, list) => {
    if (/^component/.test(element.content)) {
      components.push(compileComponent(element))
    } else {
      elementTrees.push(element)
    }
  })

  const componentIndex = components.reduce((acc, comp) => Object.assign(acc, { [comp.name]: comp }), {})

  return { elementTrees, componentIndex }
}

const processFiles = (files) => {
  files.forEach(file => {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf8')

    const { elementTrees, componentIndex } = createElements(content)

    const markup = elementTrees.map(tree => compileElementTree(tree, componentIndex)).join('')

    console.log(markup)

    writeOutput(file, markup)
  })
}

const parseFileName = (name) => name.split('/').reduce((a, val) => val).replace('.ivan', '')

const writeOutput = (sourceFileName, markup) => {
  const fileName = parseFileName(sourceFileName)

  console.log('Saving ' + fileName)

  fs.writeFileSync(path.join(__dirname, `dist/${fileName}.html`), markup, 'utf8')
}
