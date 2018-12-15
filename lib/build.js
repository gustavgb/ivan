const glob = require('glob')
const fs = require('fs-extra')
const { compileElement, compileStylesheet, compileComponent } = require('./compileCommon.js')
const { createFileTree } = require('./createTree.js')

fs.emptyDirSync('dist')

glob('pages/*.ivan', {}, (err, files) => {
  if (err) {
    throw err
  }

  console.log('Compiling pages:\n  - ' + files.join('\n  - '))

  processFiles(files)
})

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

const processFiles = (files) => {
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
