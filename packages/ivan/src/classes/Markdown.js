import Component from './../base/Component'
import { isUpperCase } from '../utils'
import marked from 'marked'
import shortid from 'shortid'
import fs from 'fs'

class Markdown extends Component {
  constructor (options) {
    super(options)

    const { children } = options

    const cleaned = children
      .replace(/^\s{1,}/, '')
      .replace(/\r\n/g, '\n')
      .replace(/^\n{1,}/, '')

    const hasMeta = /^---/.test(cleaned)
    let meta
    let body

    if (hasMeta) {
      const fileSplit = cleaned.replace(/^---\n/, '').split('\n---\n')
      meta = fileSplit[0].split('\n').reduce((acc, line) => {
        if (!line) {
          return acc
        }
        const split = line.split(':')
        const key = split[0].replace(/\s{1,}/g, '')
        const value = split[1].replace(/^\s{1,}/, '').replace(/\s{1,}$/, '')

        if (!acc[key]) {
          acc[key] = value
        } else {
          throw new Error(`Invalid markdown meta: ${line}. Value already defined. ${this.identifier}`)
        }

        return acc
      }, {})

      body = fileSplit
        .slice(1)
        .join('\n---\n')
    } else {
      body = cleaned
      meta = {}
    }

    this.meta = meta
    this.content = marked(body)
    this.name = meta.name || null

    fs.writeFileSync('dist/markdownexample.html', this.content, 'utf8')
  }

  validate (props, childBody) {
    if (!isUpperCase(this.name)) {
      throw new Error(`Invalid markdown meta: "${this.name}". Name must start with uppercase letter. ${this.identifier}`)
    }
  }

  renderRaw () {
    return this.render()
  }

  render () {
    this.validate()

    return this.content
  }
}

export default Markdown
