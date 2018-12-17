const collectExports = (files) => {
  const exports = files.reduce((result, file) => result.concat(file.transpiledFile.filter(cmd => cmd.export).map(cmd => ({
    element: cmd,
    src: file.src,
    file: file.transpiledFile,
    name: cmd.name
  }))), [])

  return exports
}

module.exports = collectExports
