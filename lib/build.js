const glob = require('glob')
const fs = require('fs-extra')
const { createFileTree } = require('./createFileTree.js')
const transpile = require('./transpile.js')
const collectExports = require('./collectExports.js')
const renderFile = require('./render.js')

const flags = process.argv.join(' ').replace(/--/gi, '-').split('-').reduce((acc, flag) => {
  const key = flag.split(' ')[0]
  const value = flag.split(' ')[1] || true
  return Object.assign(acc, { [key]: value })
}, {})

const sourceDir = flags.s.replace(/\/$/gi, '')

const processFiles = (pages, components) => {
  const files = pages.map(file => {
    const content = fs.readFileSync(file, 'utf8')

    const fileTree = createFileTree(content)

    const transpiledFile = transpile(fileTree)

    writeOutput(file, JSON.stringify(fileTree) + '\n\n' + JSON.stringify(transpiledFile), '.json')

    return { name: parseFileName(file), src: file, transpiledFile }
  })

  const globals = collectExports(files)

  writeOutput('globals', JSON.stringify(globals), '.json')

  // files.forEach(fileObj => {
  //   const markup = renderFile(fileObj.transpiledFile, globals)
  //
  //   writeOutput(fileObj.src, markup)
  // })
}

const parseFileName = (name) => name.split('/').reduce((a, val) => val).replace('.ivan', '')

const writeOutput = (sourceFileName, content, extension = '.html') => {
  const fileName = parseFileName(sourceFileName)

  console.log('Saving ' + fileName + extension)

  fs.writeFileSync(`dist/${fileName}${extension}`, content, 'utf8')
}

const build = () => {
  if (!flags.s) {
    console.warn('Please provide entry source folder with the --s flag')
    return
  }

  fs.emptyDirSync('dist')

  const files = glob.sync(sourceDir + '/**/*.ivan')

  console.log('Compiling pages (' + sourceDir + '/**/*.ivan' + '):\n  - ' + files.join('\n  - '))

  processFiles(files)
}

build()
