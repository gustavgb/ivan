"use strict";

var sass = require('node-sass');

var formatStylesheet = function formatStylesheet(stylesheet) {
  return stylesheet.replace(/\n{2,}/g, '\n').replace(/\n[^\s]/g, function (match) {
    return match.replace(/\n/, '\n\n');
  }).replace(/\n$/, '');
};

var renderStylesheet = function renderStylesheet(stylesheet) {
  var formattedStylesheet = formatStylesheet(stylesheet);
  var compiledStylesheet = sass.renderSync({
    data: formattedStylesheet,
    indentedSyntax: true,
    outputStyle: 'expanded'
  });
  return compiledStylesheet.css.toString();
};

module.exports = renderStylesheet;