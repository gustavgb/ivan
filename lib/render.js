const Import = require('./classes/Import.js')
const Layout = require('./classes/Layout.js')
const Style = require('./classes/Style.js')
const Page = require('./classes/Page.js')
const debug = require('./loghandler.js')

const createIndex = list => list.reduce((acc, el) => Object.assign(acc, { [el.name]: el }), {})

const collectComponents = (transpiledFile, globals) => {
  const imports = transpiledFile.filter(el => el instanceof Import).map(imp => {
    const el = globals.filter(g => g.element.name === imp.name)[0]

    if (!el) {
      throw new Error('Import "' + imp.name + '" invalid. Element not exported anywhere')
    }

    return el
  })

  const components = [].concat(imports).concat(transpiledFile.filter(a => (
    !!a.name &&
    (a instanceof Layout ||
    a instanceof Style)
  )))

  return components
}

const collectComponentIndex = (transpiledFile, globals) => createIndex(collectComponents(transpiledFile, globals))

const collectStyles = (transpiledFile, globals) => {
  const components = collectComponents(transpiledFile, globals)

  return components.reduce((styles, component) => {
    if (component.file) {
      return Object.assign(styles, collectStyles(component.file, globals))
    } else {
      if (component.styles) {
        styles[component.className] = component.styles
      }

      return styles
    }
  }, {})
}

const renderComponent = (child, componentObj, components, globals) => {
  let component = componentObj
  if (component.src) {
    component = componentObj.element
  }

  const props = [].concat(child.props).concat(component.defaultProps).join(' ').replace(/\s$/, '')

  let childrenBody = child.children || ''
  if (Array.isArray(child.children)) {
    childrenBody = child.children.map(child => renderChild(child, components, globals)).join('')
  }

  let children = childrenBody
  if (component.children) {
    children = component.children.map(grandchild => {
      if (grandchild.element === '!children') {
        return childrenBody
      } else {
        const childComponents = collectComponentIndex(componentObj.file, globals)

        return renderChild(grandchild, childComponents, globals)
      }
    }).join('')
  }

  return `<${component.element + (props ? ' ' + props : '')}>${children}</${component.element}>`
}

const renderElement = (child, components, globals) => {
  const props = child.props.join(' ')

  let children = child.children
  if (Array.isArray(child.children)) {
    children = child.children.map(child => renderChild(child, components, globals)).join('')
  }

  return `<${child.element + (props ? ' ' + props : '')}>${children}</${child.element}>`
}

const renderChild = (child, components, globals) => {
  let component = components[child.element]
  if (component) {
    return renderComponent(child, component, components, globals)
  } else {
    return renderElement(child, components, globals)
  }
}

const renderPage = (file, globals) => {
  const { transpiledFile, src } = file

  const components = collectComponentIndex(transpiledFile, globals)

  debug.log(src + JSON.stringify(components))

  const page = transpiledFile.filter(el => el instanceof Page)[0]

  if (!page) {
    throw new Error('Entry file must contain page element. (' + src + ')')
  }

  const styleindex = collectStyles(transpiledFile, globals)
  const stylesheet = Object.keys(styleindex).reduce((styles, key) => styles.concat([`.${key} {${styleindex[key]}}`]), [])

  const pageBody = page.children.map(child => {
    if (child.element === 'head') {
      child.children.push({
        element: 'style',
        children: stylesheet.join('\n'),
        props: []
      })
    }

    return renderChild(child, components, globals)
  }).join('')

  const markup = `<!DOCTYPE html><html>${pageBody}</html>`

  return markup
}

module.exports = renderPage
