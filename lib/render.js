const Import = require('./classes/Import.js')

const collectImports = file => file.filter(el => el instanceof Import)

const renderFile = (file, globals) => {
  const imports = collectImports

  let pass = true

  imports.forEach(imp => globals.filter())
}

module.exports = renderFile
