const section = (indent, content, parent = null) => ({
  indent: indent,
  content: content,
  parent: parent,
  children: []
})

const removeExcess = (section) => {
  if (section.children.length === 0) {
    return {
      content: section.content
    }
  } else {
    return {
      content: section.content,
      children: section.children.map(removeExcess)
    }
  }
}

const deepenStructure = (lines) => {
  let root = section(-1, 'root')
  let head = root

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.indent > head.indent) {
      const s = section(line.indent, line.content, head)
      head.children.push(s)

      head = s
    } else if (line.indent === head.indent) {
      head.parent.children.push(section(line.indent, line.content, head.parent))
    } else {
      while (line.indent < head.indent) {
        head = head.parent
      }

      const s = section(line.indent, line.content, head.parent)

      head.parent.children.push(s)
      head = s
    }
  }

  return removeExcess(root).children
}

const createFileTree = (raw) => {
  const lines = raw.split('\n').map(line => {
    let indent = 0
    for (let i = 0; i < line.length; i++) {
      if (line[i] === ' ') {
        indent++
      } else {
        break
      }
    }

    const el = {
      indent,
      content: line.substr(indent)
    }

    return el
  }).filter(el => el.content)

  const root = deepenStructure(lines)

  return root
}

module.exports = {
  createFileTree
}
