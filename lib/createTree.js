const FileTree = require('classes/FileTree.js')

class Section {
  constructor (indent, content, parent = null) {
    this.indent = indent
    this.content = content
    this.parent = parent
    this.children = []
  }

  addChild (child) {
    this.children.push(child)
  }
}

const removeExcess = (section) => {
  if (section.children.length === 0) {
    return new FileTree(section.content)
  } else {
    return new FileTree(section.content, section.children.map(removeExcess))
  }
}

const deepenStructure = (lines) => {
  let root = new Section(-1, 'root')
  let head = root

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.indent > head.indent) {
      const s = new Section(line.indent, line.content, head)
      head.addChild(s)

      head = s
    } else if (line.indent === head.indent) {
      head.parent.addChild(new Section(line.indent, line.content, head.parent))
    } else {
      while (line.indent < head.indent) {
        head = head.parent
      }

      const s = new Section(line.indent, line.content, head.parent)

      head.parent.addChild(s)
      head = s
    }
  }

  return removeExcess(root)
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
