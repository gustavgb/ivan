const transpileComponentTree = (element) => {
  const split = element.content.replace(': ', ':').split(':')
  const commandSplit = split[0].split(' ')
  const name = commandSplit[0]
  let props = commandSplit.slice(1)
  let el = name

  if (components[name]) {
    el = components[name].element
    props.push(`class="${components[name].className}"`)
  }

  let body = [split[1]]

  if (!body && element.children) {
    body = element.children.map(child => compileElement(child, components))
  } else if (!body) {
    body = []
  }

  return `<${el}${props.length ? ' ' + props.join(' ') : ''}>${body}${inject}</${el}>`
}

const aggregateFileTree = (fileTree) => {
  const result = fileTree.map((element, index, list) => {
    if (/^component/.test(element.content)) {
      return transpileComponentTree(element)
    }
  })

  return result
}

module.exports = {
  aggregateFileTree,
  transpileComponentTree
}
