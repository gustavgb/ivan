"use strict";

var prettier = require('prettier');

var renderMarkup = function renderMarkup(markup) {
  return prettier.format(markup, {
    parser: 'html',
    htmlWhitespaceSensitivity: 'strict'
  });
};

module.exports = renderMarkup;