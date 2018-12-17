const glob = require('glob')
const fs = require('fs-extra')
const { createFileTree } = require('./createFileTree.js')
const transpile = require('./transpile.js')
const collectExports = require('./collectExports.js')
const renderPage = require('./render.js')

const processFiles = (pages, components) => pages.map(file => {
  const content = fs.readFileSync(file, 'utf8')

  const fileTree = createFileTree(content)

  const transpiledFile = transpile(fileTree)

  return { src: file, transpiledFile }
})

const parseFileName = (name) => name.split('/').reduce((a, val) => val).replace('.ivan', '')

const writeOutput = (sourceFileName, content, extension = '.html') => {
  let fileName = parseFileName(sourceFileName)

  console.log('Saving ' + fileName + extension)

  if (fileName !== 'index') {
    fs.emptyDirSync('dist/' + fileName)
    fs.writeFileSync(`dist/${fileName}/index${extension}`, content, 'utf8')
  } else {
    fs.writeFileSync(`dist/${fileName}${extension}`, content, 'utf8')
  }
}

const build = (sourceDir) => {
  fs.emptyDirSync('dist')

  const pagePaths = []
  const pagePrefix = new RegExp('^example/pages')

  const filePaths = glob.sync(sourceDir + '/!(static)/**/*.ivan').filter(file => {
    if (pagePrefix.test(file)) {
      pagePaths.push(file)
      return false
    }
    return true
  })

  console.log('Compiling pages:\n  - ' + [].concat(filePaths, pagePaths).join('\n  - '))

  const files = processFiles(filePaths)
  const pages = processFiles(pagePaths)

  const globals = collectExports(files)

  pages.forEach(fileObj => {
    const markup = renderPage(fileObj, globals)

    writeOutput(fileObj.src, markup)
  })
}

module.exports = build
