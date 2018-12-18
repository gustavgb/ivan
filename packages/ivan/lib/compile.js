const glob = require('glob')
const fs = require('fs-extra')
const parseFile = require('./parseFile.js')
const transpile = require('./transpile.js')
const collectExports = require('./collectExports.js')

const processFiles = (pages, components) => pages.map(file => {
  const content = fs.readFileSync(file, 'utf8')

  const fileTree = parseFile(content)

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

const compile = (sourceDir) => {
  fs.emptyDirSync('dist')

  const pagePaths = []
  const pagePrefix = new RegExp(`^${sourceDir}/pages`)

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
    const markup = fileObj.transpiledFile.filter(el => el.entry)[0].render(globals)

    writeOutput(fileObj.src, markup)
  })

  if (fs.pathExistsSync(sourceDir + '/static')) {
    fs.copySync(sourceDir + '/static', 'dist')
  }
}

module.exports = compile
