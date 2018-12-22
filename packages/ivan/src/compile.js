const glob = require('glob')
const fs = require('fs-extra')

const parseFile = require('./parseFile')
const transpile = require('./transpile')
const collectExports = require('./collectExports')
const renderMarkup = require('./renderMarkup')

const processFiles = (pages, components) => pages.map(file => {
  const content = fs.readFileSync(file, 'utf8')

  try {
    const fileTree = parseFile(content)

    const transpiledFile = transpile(fileTree)

    return { src: file, transpiledFile }
  } catch (e) {
    throw new Error(`${e.message} (${file})`)
  }
})

const parseFileName = (name) => name.split('/').reduce((a, val) => val).replace('.ivan', '')

const parseFileDir = (name) => name.split('pages/')[1].split('/').reduce((a, val, index, list) => {
  if (index < list.length - 1) {
    return val
  } else {
    return a
  }
}, '')

const writeOutput = (sourceFileName, content, extension = '.html') => {
  let fileName = parseFileName(sourceFileName)
  let fileDir = parseFileDir(sourceFileName)
  if (fileDir.length > 0) fileDir += '/'

  if (fileName !== 'index') {
    fs.emptyDirSync('dist/' + fileDir + fileName)
    fs.writeFileSync(`dist/${fileDir}${fileName}/index${extension}`, content, 'utf8')

    console.log(`Saving ${fileDir}${fileName}/index${extension}`)
  } else {
    fs.writeFileSync(`dist/${fileDir}${fileName}${extension}`, content, 'utf8')
    console.log(`Saving ${fileDir}${fileName}${extension}`)
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
    try {
      const markup = fileObj.transpiledFile.filter(el => el.entry)[0].render(globals)
      const formattedMarkup = renderMarkup(markup)

      writeOutput(fileObj.src, formattedMarkup)
    } catch (e) {
      throw new Error(`${e.message} (${fileObj.src})`)
    }
  })

  if (fs.pathExistsSync(sourceDir + '/static')) {
    fs.copySync(sourceDir + '/static', 'dist')
  }
}

module.exports = compile
