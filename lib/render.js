const Import = require('./classes/Import.js')
const Layout = require('./classes/Layout.js')
const Style = require('./classes/Style.js')
const Page = require('./classes/Page.js')

const createIndex = list => list.reduce((acc, el) => Object.assign(acc, { [el.name]: el }), {})

const collectComponents = (transpiledFile, globals) => {
  const imports = transpiledFile.filter(el => el instanceof Import).map(imp => {
    const el = globals.filter(g => g.element.name === imp.name)[0]

    if (!el) {
      throw new Error('Import "' + imp.name + '" invalid. Element not exported anywhere')
    }

    return el
  })

  const components = createIndex([].concat(imports).concat(transpiledFile.filter(a => (
    !!a.name &&
    (a instanceof Layout ||
    a instanceof Style)
  ))))

  return components
}

const renderComponent = (child, component, components, globals) => {
  const props = [].concat(child.props).concat(component.defaultProps).join(' ').replace(/\s$/, '')
  const tag = component.element + (props ? ' ' + props : '')

  let childrenBody = child.children
  if (Array.isArray(child.children)) {
    childrenBody = child.children.map(child => renderChild(child, components, globals)).join('')
  }

  let children = childrenBody
  if (component.children) {
    children = component.children.map(grandchild => {
      if (grandchild.element === '!children') {
        return childrenBody
      } else {
        return renderChild(grandchild, components, globals)
      }
    }).join('')
  }

  return `<${tag}>${children}</${component.element}>`
}

const renderElement = (child, components, globals) => {
  const props = child.props.join(' ')
  const tag = child.element + (props ? ' ' + props : '')

  let children = child.children
  if (Array.isArray(child.children)) {
    children = child.children.map(child => renderChild(child, components, globals)).join('')
  }

  return `<${tag}>${children}</${child.element}>`
}

const renderChild = (child, components, globals) => {
  let component = components[child.element]
  if (component) {
    if (component.src) {
      const childComponents = collectComponents(component.file, globals)

      return renderComponent(child, component.element, childComponents, globals)
    } else {
      return renderComponent(child, component, components, globals)
    }
  } else {
    return renderElement(child, components, globals)
  }
}

const renderPage = (file, globals) => {
  const { transpiledFile, src } = file

  const components = collectComponents(transpiledFile, globals)

  const page = transpiledFile.filter(el => el instanceof Page)[0]

  if (!page) {
    throw new Error('Entry file must contain page element. (' + src + ')')
  }

  const markup = page.children.map(child => renderChild(child, components, globals)).join('')

  return markup
}

module.exports = renderPage
