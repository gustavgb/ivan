import { minify } from 'html-minifier'

const renderMarkup = (markup) => {
  return minify(markup)
}

export default renderMarkup
