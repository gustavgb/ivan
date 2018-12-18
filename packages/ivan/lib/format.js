const formatStylesheet = (stylesheet) => {
  return stylesheet
    .replace(/\n/g, '')
    .replace(/{/g, '{\n')
    .replace(/}/g, '}\n\n')
    .replace(/;/g, ';\n')
    .replace(/\n$/, '')
}

module.exports = {
  formatStylesheet
}
