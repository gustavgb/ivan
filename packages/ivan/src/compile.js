import glob from 'glob'
import fs from 'fs-extra'
import { promisify } from 'util'

import parse from './parse'
import collectExports from './collectExports'
import renderMarkup from './renderMarkup'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const getFileName = (name) => name.split('/').reduce((a, val) => val).replace('.ivan', '')
const getFileDir = (name) => name.split('pages/')[1].split('/').reduce((a, val, index, list) => {
  if (index < list.length - 1) {
    return val
  } else {
    return a
  }
}, '')

const writeOutput = async (sourceFileName, content, extension = '.html') => {
  try {
    let fileName = getFileName(sourceFileName)
    let fileDir = getFileDir(sourceFileName)
    if (fileDir.length > 0) fileDir += '/'

    if (fileName !== 'index') {
      await fs.emptyDir('dist/' + fileDir + fileName)
      await writeFile(`dist/${fileDir}${fileName}/index${extension}`, content, 'utf8')

      console.log(`Saving ${fileDir}${fileName}/index${extension}`)
    } else {
      await writeFile(`dist/${fileDir}${fileName}${extension}`, content, 'utf8')
      console.log(`Saving ${fileDir}${fileName}${extension}`)
    }
  } catch (e) {
    throw e
  }
}

const readFiles = (sourceDir) => new Promise((resolve, reject) => {
  class File {
    constructor (src, content) {
      this.src = src
      this.content = content
    }
  }

  glob(sourceDir + '/!(static)/**/*.ivan', (err, files) => {
    if (err) {
      reject(err)
    }

    Promise.all(files.map(async (filePath) => {
      try {
        const result = await readFile(filePath, 'utf8')
        return new File(filePath, result)
      } catch (e) {
        return reject(e)
      }
    }))
      .then(result => {
        console.log('Found following files:\n  - ' + result.map(f => f.src).join('\n  - '))

        const pagePrefix = new RegExp(`^${sourceDir}/pages`)
        const pages = []
        const files = result.filter(file => {
          if (pagePrefix.test(file.src)) {
            pages.push(file)
            return false
          }
          return true
        })

        return resolve({ pages, files })
      })
      .catch(reject)
  })
})

const parseFiles = ({ pages, files }) => new Promise((resolve, reject) => {
  try {
    const mapper = file => ({ src: file.src, result: parse(file.content, file.src) })
    const parsedFiles = files.map(mapper)
    const parsedPages = pages.map(mapper)

    const globals = collectExports(parsedFiles)

    resolve({ globals, pages: parsedPages })
  } catch (e) {
    reject(e)
  }
})

const renderPages = ({ globals, pages }) => Promise.all(pages.map(fileObj => new Promise((resolve, reject) => {
  try {
    const markup = fileObj.result.filter(el => el.isEntry)[0].render(globals)
    const formattedMarkup = renderMarkup(markup)

    writeOutput(fileObj.src, formattedMarkup)

    resolve()
  } catch (e) {
    reject(e)
  }
})))

const copyStaticFiles = async (sourceDir) => {
  if (await fs.pathExists(sourceDir + '/static')) {
    await fs.copy(sourceDir + '/static', 'dist')
    return true
  }
  return false
}

const compile = (sourceDir) => new Promise((resolve, reject) => {
  fs.emptyDir('dist')
    .then(() => readFiles(sourceDir))
    .then(res => parseFiles(res))
    .then(res => renderPages(res))
    .then(() => copyStaticFiles(sourceDir))
    .catch(reject)
})

export default compile
