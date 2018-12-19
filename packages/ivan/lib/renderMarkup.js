const prettier = require('prettier')

const renderMarkup = (markup) => {
  return prettier.format(markup, {
    parser: 'html',
    htmlWhitespaceSensitivity: 'strict'
  })
}

module.exports = renderMarkup
