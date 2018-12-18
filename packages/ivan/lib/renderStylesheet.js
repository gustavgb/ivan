const sass = require('node-sass')

const renderStylesheet = (formattedStylesheet) => {
  const compiledStylesheet = sass.renderSync({
    data: formattedStylesheet,
    indentedSyntax: true,
    outputStyle: 'expanded'
  })

  return compiledStylesheet.css.toString()
}

module.exports = renderStylesheet
