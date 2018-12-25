import renderStylesheet from './../renderStylesheet'
import Component from './../base/Component'

class Page extends Component {
  constructor (options) {
    super(options)

    this.isEntry = true
  }

  render (globals) {
    const styleindex = {}

    let pageBody = this.children.map(child => child.render(globals, styleindex)).join('')

    const stylesheet = Object.keys(styleindex).reduce((styles, key) => styles.concat([`.${key}\n${styleindex[key]}`]), []).join('\n')

    const compiledStylesheet = renderStylesheet(stylesheet)

    const stylesheetMarkup = `<style>\n${compiledStylesheet}</style>`

    pageBody = pageBody.replace('</head>', stylesheetMarkup + '</head>')

    const markup = `<!DOCTYPE html><html>${pageBody}</html>`

    return markup
  }
}

export default Page
