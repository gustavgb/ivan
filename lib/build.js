const glob = require('glob')
const fs = require('fs-extra')
const { compileElement, compileStylesheet, compileComponent } = require('./compileCommon.js')
const { createFileTree } = require('./createFileTree.js')
const transpile = require('./transpile.js')

const flags = process.argv.join(' ').split('--').reduce((acc, flag) => {
  const key = flag.split(' ')[0]
  const value = flag.split(' ')[1] || true
  return Object.assign(acc, { [key]: value })
}, {})

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
  pages.forEach(file => {
    const content = fs.readFileSync(file, 'utf8')

    const fileTree = createFileTree(content)

    const handledFileTree = transpile(fileTree)

    writeOutput(file, JSON.stringify(fileTree) + '\n\n' + JSON.stringify(handledFileTree))

    return

    const markup = createMarkup(tree)
  })
}

const parseFileName = (name) => name.split('/').reduce((a, val) => val).replace('.ivan', '')

const writeOutput = (sourceFileName, content) => {
  const fileName = parseFileName(sourceFileName)

  console.log('Saving ' + fileName + '.json')

  fs.writeFileSync(`dist/${fileName}.json`, content, 'utf8')
}

const build = () => {
  if (!flags.s) {
    console.warn('Please provide entry source folder with the --s flag')
    return
  }

  fs.emptyDirSync('dist')

  const files = glob.sync(flags.s + '/**/*.ivan')

  console.log('Compiling pages (' + flags.s + '/**/*.ivan' + '):\n  - ' + files.join('\n  - '))

  processFiles(files)
}

build()
