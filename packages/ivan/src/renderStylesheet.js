import sass from 'node-sass'

const formatStylesheet = (stylesheet) => {
  return stylesheet
    .replace(/\n{2,}/g, '\n')
    .replace(/\n[^\s]/g, (match) => match.replace(/\n/, '\n\n'))
    .replace(/\n$/, '')
}

const renderStylesheet = (stylesheet) => {
  if (!stylesheet) {
    return ''
  }

  const formattedStylesheet = formatStylesheet(stylesheet)

  const compiledStylesheet = sass.renderSync({
    data: formattedStylesheet,
    indentedSyntax: true,
    outputStyle: 'expanded'
  })

  return compiledStylesheet.css.toString()
}

export default renderStylesheet
