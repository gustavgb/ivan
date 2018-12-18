const { collectComponentIndex } = require('./../collectComponents')
const { formatStylesheet } = require('./../format')

class Page {
  constructor (children) {
    this.children = children
    this.file = null
    this.entry = true
  }

  render (globals, inject = '') {
    const styleindex = {}
    const components = collectComponentIndex(this.file, globals)

    let pageBody = this.children.map(child => {
      if (child.element === 'head') {
        return child.render(components, globals, styleindex, '!stylesheet')
      } else {
        return child.render(components, globals, styleindex)
      }
    }).join('')

    const stylesheet = Object.keys(styleindex).reduce((styles, key) => styles.concat([`.${key} {${styleindex[key]}}`]), []).join('')

    const formattedStylesheet = `<style>\n${formatStylesheet(stylesheet)}</style>`

    pageBody = pageBody.replace('!stylesheet', formattedStylesheet)

    const markup = `<!DOCTYPE html><html>${pageBody}${inject}</html>`

    return markup
  }
}

module.exports = Page
