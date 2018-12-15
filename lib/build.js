const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')
const { compileElementTree, compileStylesheet, compileComponent } = require('./compileCommon.js')
const { createFileTree } = require('./createTree.js')

const createPath = (...args) => path.join(__dirname, '..', ...args)

fs.emptyDirSync(createPath('dist'))

glob('pages/*.ivan', {}, (err, files) => {
  if (err) {
    throw err
  }

  processFiles(files)
})

const createMarkup = (fileTree) => {
  let headTree
  let bodyTree
  const components = []

  fileTree.forEach((element, index, list) => {
    if (/^component/.test(element.content)) {
      components.push(compileComponent(element))
    } else if (/^head/.test(element.content)) {
      headTree = element
    } else if (/^body/.test(element.content)) {
      bodyTree = element
    }
  })

  if (!headTree || !bodyTree) {
    throw new Error('Must include head and body.')
  }

  const stylesheet = compileStylesheet(components)

  const componentIndex = components.reduce((acc, comp) => Object.assign(acc, { [comp.name]: comp }), {})

  const markup = `<!DOCTYPE html><html>${
    [
      compileElementTree(headTree, componentIndex, stylesheet),
      compileElementTree(bodyTree, componentIndex)
    ].join('')
  }</html>`

  return markup
}

const processFiles = (files) => {
  files.forEach(file => {
    const content = fs.readFileSync(createPath(file), 'utf8')

    const tree = createFileTree(content)

    const markup = createMarkup(tree)

    writeOutput(file, markup)
  })
}

const parseFileName = (name) => name.split('/').reduce((a, val) => val).replace('.ivan', '')

const writeOutput = (sourceFileName, markup) => {
  const fileName = parseFileName(sourceFileName)

  console.log('Saving ' + fileName + '.html')

  fs.writeFileSync(createPath(`dist/${fileName}.html`), markup, 'utf8')
}
