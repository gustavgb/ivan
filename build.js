const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')

fs.emptyDirSync(path.join(__dirname, 'dist'))

glob('pages/*.js', {}, (err, files) => {
  if (err) {
    throw err
  }

  console.log(files)

  processFiles(files)
})

const processFiles = (files) => {
  files.forEach(file => {
    const content = require(path.join(__dirname, file))

    console.log(content)

    const markup = createMarkup(content)

    console.log(markup)

    writeOutput(file, markup)
  })
}

const formatProps = (props) => {
  return props ? ' ' + props.map(prop => {
    const split = prop.split('=')
    if (split.length <= 2) {
      return `${split[0]}="${split[1]}"`
    } else {
      return ''
    }
  }).join(' ') : ''
}

const createMarkup = (template) => {
  console.log(template)

  const keys = Object.keys(template).map(key => {
    let el = template[key]
    let props

    if (Array.isArray(el)) {
      props = el.slice(0, el.length - 1)

      el = el[el.length - 1]
    }

    let children
    if (typeof el === 'string') {
      children = el
    } else {
      children = createMarkup(el)
    }

    const formattedProps = formatProps(props)

    return `<${key}${formattedProps}>${children}</${key}>`
  })

  return keys.join('')
}

const parseFileName = (name) => name.split('/').reduce((a, val) => val).replace('.js', '')

const writeOutput = (sourceFileName, markup) => {
  const fileName = parseFileName(sourceFileName)

  console.log('Saving ' + fileName)

  fs.writeFileSync(path.join(__dirname, `dist/${fileName}.html`), markup, 'utf8')
}
