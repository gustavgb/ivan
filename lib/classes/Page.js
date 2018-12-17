const mapChild = (child) => ({
  element: child.commandArgs[0],
  props: child.commandArgs.slice(1),
  children: child.commandBody || child.children.map(mapChild)
})

class Page {
  constructor (children) {
    this.children = children.map(mapChild)
  }
}

module.exports = Page
