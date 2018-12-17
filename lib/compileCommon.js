const createShortId = require('shortid')

const compileComponent = (component) => {
  const styles = component.children.map(child => child.content)
  const command = component.content.replace(/^component /, '').replace(/ /gi, '').split(':')
  return {
    name: command[0],
    element: command[1],
    className: command[0] + '_' + createShortId(),
    styles
  }
}

const compileElement = (element, components, inject = '') => {
  const split = element.content.replace(': ', ':').split(':')
  const commandSplit = split[0].split(' ')
  const name = commandSplit[0]
  let props = commandSplit.slice(1)
  let el = name

  if (components[name]) {
    el = components[name].element
    props.push(`class="${components[name].className}"`)
  }

  let body = split[1]

  if (!body && element.children) {
    body = element.children.map(child => compileElement(child, components)).join('')
  } else if (!body) {
    body = ''
  }

  return `<${el}${props.length ? ' ' + props.join(' ') : ''}>${body}${inject}</${el}>`
}

const compileStylesheet = (components) => {
  const styles = components.map(comp => `.${comp.className} {
  ${comp.styles.join('\n')}
}\n`).join('')
  return `<style>${styles}</style>`
}

const createMarkup = (fileTree) => {
  let headTree
  let bodyTree
  const components = []
  const componentIndex = {}

  fileTree.forEach((element, index, list) => {
    if (/^component/.test(element.content)) {
      const compiledComponent = compileComponent(element)
      components.push(compiledComponent)
      componentIndex[compiledComponent.name] = compiledComponent
    } else if (/^head/.test(element.content)) {
      if (headTree) {
        throw new Error('Only one head element allowed')
      }
      headTree = element
    } else if (/^body/.test(element.content)) {
      if (bodyTree) {
        throw new Error('Only one body element allowed')
      }
      bodyTree = element
    }
  })

  if (!headTree || !bodyTree) {
    throw new Error('Must include head and body.')
  }

  const stylesheet = compileStylesheet(components)

  const markup = `<!DOCTYPE html><html>${
    [
      compileElement(headTree, componentIndex, stylesheet),
      compileElement(bodyTree, componentIndex)
    ].join('')
  }</html>`

  return markup
}

module.exports = {
  compileStylesheet,
  compileComponent,
  compileElement,
  createMarkup
}
