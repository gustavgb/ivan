const collectExports = (files) => {
  const exports = files.reduce((result, file) => result.concat(file.result.filter(cmd => cmd.isExport)), [])

  return exports
}

export default collectExports
