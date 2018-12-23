const Statement = require('./classes/Statement')
const Line = require('./classes/Line')
const Section = require('./classes/Section')

const createLines = (fileContent) => {
  return fileContent.split('\n').map(line => {
    let indent = 0
    for (let i = 0; i < line.length; i++) {
      if (line[i] === ' ') {
        indent++
      } else {
        break
      }
    }

    return new Line(indent, line.substr(indent))
  }).filter(el => el.content)
}

const createSections = (lines) => {
  let root = new Section(-1, 'root')
  let head = root

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.indent > head.indent) {
      const s = new Section(line.indent, line.content, head)
      head.addChild(s)

      head = s
    } else if (line.indent === head.indent) {
      const s = new Section(line.indent, line.content, head.parent)
      head.parent.addChild(s)

      head = s
    } else {
      while (line.indent < head.indent) {
        head = head.parent
      }

      const s = new Section(line.indent, line.content, head.parent)

      head.parent.addChild(s)
      head = s
    }
  }

  return root
}

const createStatements = (section) => new Statement(section.indent, section.content, section.children.map(createStatements))

const parseFile = (raw) => {
  const lines = createLines(raw)
  const rootSection = createSections(lines)
  return createStatements(rootSection)
}

module.exports = parseFile
