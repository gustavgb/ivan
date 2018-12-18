const formatStylesheet = (stylesheet) => {
  return stylesheet
    .replace(/\n{2,}/g, '\n')
    .replace(/\n[^\s]/g, (match) => match.replace(/\n/, '\n\n'))
    .replace(/\n$/, '')
}

module.exports = {
  formatStylesheet
}
