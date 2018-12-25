import renderStylesheet from './../renderStylesheet'
import collectComponentIndex from './../collectComponents'

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

    const stylesheet = Object.keys(styleindex).reduce((styles, key) => styles.concat([`.${key}\n${styleindex[key]}`]), []).join('\n')

    const compiledStylesheet = renderStylesheet(stylesheet)

    const stylesheetMarkup = `<style>\n${compiledStylesheet}</style>`

    pageBody = pageBody.replace('</head>', stylesheetMarkup + '</head>')

    const markup = `<!DOCTYPE html><html>${pageBody}</html>`

    return markup
  }
}

export default Page
