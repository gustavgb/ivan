const glob = require('glob')
const fs = require('fs-extra')
const { compileElement, compileStylesheet, compileComponent } = require('./compileCommon.js')
const { createFileTree } = require('./createTree.js')

const createMarkup = (fileTree) => {
  let headTree
  let bodyTree
  const components = []
  const componentIndex = {}

  fileTree.forEach((element, index, list) => {
    if (/^component/.test(element.content)) {
      const compiledComponent = compileComponent(element)
      components.push(compiledComponent)
      componentIndex[compiledComponent.name] = compiledComponent
    } else if (/^head/.test(element.content)) {
      if (headTree) {
        throw new Error('Only one head element allowed')
      }
      headTree = element
    } else if (/^body/.test(element.content)) {
      if (bodyTree) {
        throw new Error('Only one body element allowed')
      }
      bodyTree = element
    }
  })

  if (!headTree || !bodyTree) {
    throw new Error('Must include head and body.')
  }

  const stylesheet = compileStylesheet(components)

  const markup = `<!DOCTYPE html><html>${
    [
      compileElement(headTree, componentIndex, stylesheet),
      compileElement(bodyTree, componentIndex)
    ].join('')
  }</html>`

  return markup
}

const processFiles = (pages, components) => {
  const globalComponents = components.map(comp => {
    const content = fs.readFileSync(comp, 'utf8')

    return createFileTree(content)
  })

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8')

    const tree = createFileTree(content)

    const markup = createMarkup(tree)

    writeOutput(file, markup)
  })
}

const parseFileName = (name) => name.split('/').reduce((a, val) => val).replace('.ivan', '')

const writeOutput = (sourceFileName, markup) => {
  const fileName = parseFileName(sourceFileName)

  console.log('Saving ' + fileName + '.html')

  fs.writeFileSync(`dist/${fileName}.html`, markup, 'utf8')
}

const build = () => {
  fs.emptyDirSync('dist')

  const components = glob.sync('components/**/*.ivan')
  const pages = glob.sync('pages/**/*.ivan')

  console.log('Compiling pages:\n  - ' + [].concat(components).concat(pages).join('\n  - '))

  //processFiles(pages, components)
}

build()
