import prettier from 'prettier'

const renderMarkup = (markup) => {
  return prettier.format(markup, {
    parser: 'html',
    htmlWhitespaceSensitivity: 'strict'
  })
}

export default renderMarkup
