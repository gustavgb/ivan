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

const compileElementTree = (tree, components, inject = '') => {
  const split = tree.content.replace(': ', ':').split(':')
  const commandSplit = split[0].split(' ')
  const name = commandSplit[0]
  let props = commandSplit.slice(1)
  let el = name

  if (components[name]) {
    el = components[name].element
    props.push(`class="${components[name].className}"`)
  }

  let body = split[1]

  if (!body && tree.children) {
    body = tree.children.map(tree => compileElementTree(tree, components)).join('')
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

module.exports = {
  compileStylesheet,
  compileComponent,
  compileElementTree
}
