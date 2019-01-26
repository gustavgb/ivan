const uppercase = /^[A-Z][A-Za-z0-9_-]{0,}$/

export const isUpperCase = (str) => uppercase.test(str)

const voidElements = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
  'command',
  'keygen',
  'menuitem'
]

export const isVoidElement = (name) => voidElements.filter(el => el === name)[0]
