"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var collectComponentIndex = require('./../collectComponents');

var renderStylesheet = require('./../renderStylesheet');

var Page =
/*#__PURE__*/
function () {
  function Page(children) {
    _classCallCheck(this, Page);

    this.children = children;
    this.file = null;
    this.entry = true;
  }

  _createClass(Page, [{
    key: "render",
    value: function render(globals) {
      var styleindex = {};
      var components = collectComponentIndex(this.file, globals);
      var pageBody = this.children.map(function (child) {
        return child.render(components, globals, styleindex);
      }).join('');
      var stylesheet = Object.keys(styleindex).reduce(function (styles, key) {
        return styles.concat([".".concat(key, "\n").concat(styleindex[key])]);
      }, []).join('\n');
      var compiledStylesheet = renderStylesheet(stylesheet);
      var stylesheetMarkup = "<style>\n".concat(compiledStylesheet, "</style>");
      pageBody = pageBody.replace('</head>', stylesheetMarkup + '</head>');
      var markup = "<!DOCTYPE html><html>".concat(pageBody, "</html>");
      return markup;
    }
  }]);

  return Page;
}();

module.exports = Page;