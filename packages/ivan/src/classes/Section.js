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

module.exports = Section
