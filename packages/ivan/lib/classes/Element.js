"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Element =
/*#__PURE__*/
function () {
  function Element(element, props, body, bodyArgs, children, statement) {
    _classCallCheck(this, Element);

    this.element = element;
    this.props = props;
    this.body = body;
    this.bodyArgs = bodyArgs;
    this.children = children;
    this.statement = statement;
  }

  _createClass(Element, [{
    key: "renderRaw",
    value: function renderRaw() {
      var indentationOffset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var childRenderer = arguments.length > 1 ? arguments[1] : undefined;
      var line = this.statement.lineContent;
      var indentation = [];

      for (var i = 0; i < this.statement.indentation + indentationOffset; i++) {
        indentation.push(' ');
      }

      var children = '';

      if (Array.isArray(this.children)) {
        if (childRenderer) {
          children = '\n' + this.children.map(function (child) {
            return childRenderer(child);
          }).join('\n');
        } else {
          children = '\n' + this.children.map(function (child) {
            return child.renderRaw(indentationOffset);
          }).join('\n');
        }
      }

      return "".concat(indentation.join('')).concat(line).concat(children);
    }
  }, {
    key: "render",
    value: function render(components, globals, stylesheet) {
      var body = '';
      var bodyElement = this.bodyArgs[0];

      if (bodyElement) {
        if (this.element && components[bodyElement]) {
          body = components[bodyElement].render('', this.bodyArgs.slice[1], globals, stylesheet);
        } else {
          body = this.body.replace(/\s{2,}/, function (match) {
            return match.replace(/\s/g, '&nbsp;');
          }).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g, '<br>');
        }
      } else if (Array.isArray(this.children)) {
        body = this.children.map(function (child) {
          return child.render(components, globals, stylesheet);
        }).join('');
      }

      var component = components[this.element];

      if (component) {
        return component.render(body, this.props, globals, stylesheet);
      } else {
        var attrs = this.props.join(' ');
        var tag = this.element;
        var markup;

        if (tag) {
          if (body) {
            markup = "<".concat(tag).concat(attrs ? ' ' + attrs : '', ">").concat(body, "</").concat(tag, ">");
          } else {
            markup = "<".concat(tag).concat(attrs ? ' ' + attrs : '', " />");
          }
        } else {
          markup = body;
        }

        return markup;
      }
    }
  }]);

  return Element;
}();

module.exports = Element;