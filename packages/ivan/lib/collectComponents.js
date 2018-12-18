const createIndex = list => list.reduce((acc, el) => Object.assign(acc, { [el.name]: el }), {})

const collectComponents = (transpiledFile, globals) => {
  const imports = transpiledFile.filter(el => el.type === 'import').map(imp => {
    const el = globals.filter(g => g.name === imp.name)[0]

    if (!el) {
      throw new Error('Import "' + imp.name + '" invalid. Element not exported anywhere')
    }

    return el
  })

  return [].concat(imports).concat(transpiledFile.filter(a => !!a.name && a.type === 'component'))
}

const collectComponentIndex = (transpiledFile, globals) => createIndex(collectComponents(transpiledFile, globals))

module.exports = {
  collectComponents,
  collectComponentIndex
}
