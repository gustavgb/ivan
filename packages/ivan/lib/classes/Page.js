const collectComponentIndex = require('./../collectComponents')
const { formatStylesheet } = require('./../format')
const renderStylesheet = require('./../renderStylesheet')

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
      const realChild = components[child.element] || child
      if (realChild.element === 'head') {
        return child.render(components, globals, styleindex, '!stylesheet')
      } else {
        return child.render(components, globals, styleindex)
      }
    }).join('')

    const stylesheet = Object.keys(styleindex).reduce((styles, key) => styles.concat([`.${key}\n${styleindex[key]}`]), []).join('')
    const formattedStylesheet = formatStylesheet(stylesheet)
    const compiledStylesheet = renderStylesheet(formattedStylesheet)

    const stylesheetMarkup = `<style>\n${compiledStylesheet}</style>`

    pageBody = pageBody.replace('!stylesheet', stylesheetMarkup)

    const markup = `<!DOCTYPE html><html>${pageBody}${inject}</html>`

    return markup
  }
}

module.exports = Page
