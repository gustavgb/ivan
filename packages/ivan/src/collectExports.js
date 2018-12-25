const collectExports = (files) => {
  const exports = files.reduce((result, file) => result.concat(file.transpiledFile.filter(cmd => cmd.type === 'export')), [])

  return exports
}

export default collectExports
