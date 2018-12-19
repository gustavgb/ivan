const collectComponentIndex = require('./../collectComponents')
const renderStylesheet = require('./../renderStylesheet')

class Page {
  constructor (children) {
    this.children = children
    this.file = null
    this.entry = true
  }

  render (globals) {
    const styleindex = {}
    const components = collectComponentIndex(this.file, globals)

    let pageBody = this.children.map(child => child.render(components, globals, styleindex)).join('')

    const stylesheet = Object.keys(styleindex).reduce((styles, key) => styles.concat([`.${key}\n${styleindex[key]}`]), []).join('')
    const compiledStylesheet = renderStylesheet(stylesheet)

    const stylesheetMarkup = `<style>\n${compiledStylesheet}</style>`

    pageBody = pageBody.replace('</head>', stylesheetMarkup + '</head>')

    const markup = `<!DOCTYPE html><html>${pageBody}</html>`

    return markup
  }
}

module.exports = Page
