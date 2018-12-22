"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var shortId = require('shortid');

var collectComponentIndex = require('./../collectComponents');

var Style =
/*#__PURE__*/
function () {
  function Style(name, element) {
    var defaultProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var children = arguments.length > 3 ? arguments[3] : undefined;

    _classCallCheck(this, Style);

    var className = name + shortId();
    this.name = name;
    this.element = element;
    this.className = className;
    this.defaultProps = defaultProps;
    this.children = children;
    this.type = 'component';
  }

  _createClass(Style, [{
    key: "renderChild",
    value: function renderChild(child, indentationOffset, components, globals) {
      var _this = this;

      if (components[child.element] instanceof Style) {
        return components[child.element].renderStyles(globals, child.statement.indentation + indentationOffset);
      } else {
        return child.renderRaw(indentationOffset, function (grandchild) {
          return _this.renderChild(grandchild, indentationOffset, components, globals);
        });
      }
    }
  }, {
    key: "renderStyles",
    value: function renderStyles(globals) {
      var _this2 = this;

      var parentIndentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var components = collectComponentIndex(this.file, globals);
      return this.children.map(function (child) {
        return _this2.renderChild(child, parentIndentation - child.statement.indentation, components, globals);
      }).join('\n');
    }
  }, {
    key: "render",
    value: function render(childBody, props, globals, stylesheet) {
      var tag = this.element;
      var attrs = [].concat(props).concat(this.defaultProps).concat(["class=\"".concat(this.className, "\"")]).join(' ');
      var styles = this.renderStyles(globals, 2);
      stylesheet[this.className] = styles;

      if (!tag) {
        throw new Error('Style component (' + this.name + ') has no tag and therefore cannot be rendered.');
      }

      if (childBody) {
        return "<".concat(tag).concat(attrs ? ' ' + attrs : '', ">").concat(childBody, "</").concat(tag, ">");
      }

      return "<".concat(tag).concat(attrs ? ' ' + attrs : '', " />");
    }
  }]);

  return Style;
}();

module.exports = Style;