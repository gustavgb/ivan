const collectComponents = (transpiledFile, globals) => {
  const imports = transpiledFile.filter(el => el.type === 'import').map(imp => {
    const component = globals.filter(g => g.name === imp.name)[0]

    if (!component) {
      throw new Error('Import "' + imp.name + '" invalid. Component not exported anywhere')
    }

    return {
      component,
      mapTo: imp.mapTo || imp.name
    }
  })

  const importIndex = imports.reduce((acc, imp) => Object.assign(acc, { [imp.mapTo]: imp.component }), {})

  const fileIndex = transpiledFile.filter(a => !!a.name && a.type === 'component').reduce((acc, el) => Object.assign(acc, { [el.name]: el }), {})

  return Object.assign({}, importIndex, fileIndex)
}

module.exports = collectComponents
