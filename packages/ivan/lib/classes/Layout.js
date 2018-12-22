"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var collectComponentIndex = require('./../collectComponents');

var Layout =
/*#__PURE__*/
function () {
  function Layout(name, element, props, children) {
    _classCallCheck(this, Layout);

    this.element = element;
    this.name = name;
    this.defaultProps = props;
    this.children = children;
    this.file = null;
    this.type = 'component';
  }

  _createClass(Layout, [{
    key: "render",
    value: function render() {
      var childBody = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var props = arguments.length > 1 ? arguments[1] : undefined;
      var globals = arguments.length > 2 ? arguments[2] : undefined;
      var stylesheet = arguments.length > 3 ? arguments[3] : undefined;
      var components = collectComponentIndex(this.file, globals);
      var body = this.children.map(function (child) {
        return child.element === '!children' ? child.element : child.render(components, globals, stylesheet);
      }).join('').replace('!children', childBody);

      if ((!this.children || this.children.length === 0) && childBody) {
        body = childBody;
      }

      var rootComponent = components[this.element];

      if (rootComponent) {
        return rootComponent.render(body, [].concat(this.defaultProps).concat(props), globals, stylesheet);
      }

      var tag = this.element;
      var attrs = [].concat(this.defaultProps).concat(props).join(' ');

      if (!tag) {
        return body;
      }

      return "<".concat(tag).concat(attrs ? ' ' + attrs : '', ">").concat(body, "</").concat(tag, ">");
    }
  }]);

  return Layout;
}();

module.exports = Layout;