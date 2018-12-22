"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var renderStylesheet = require('./../renderStylesheet');

var Inject =
/*#__PURE__*/
function () {
  function Inject(name, element) {
    var defaultProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var children = arguments.length > 3 ? arguments[3] : undefined;

    _classCallCheck(this, Inject);

    this.name = name;
    this.element = element;
    this.defaultProps = defaultProps;
    this.children = children;
    this.type = 'component';
  }

  _createClass(Inject, [{
    key: "render",
    value: function render() {
      var childBody = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var props = arguments.length > 1 ? arguments[1] : undefined;
      var globals = arguments.length > 2 ? arguments[2] : undefined;
      var stylesheet = arguments.length > 3 ? arguments[3] : undefined;
      var tag = this.element;
      var attrs = [].concat(props).concat(this.defaultProps).join(' ');
      var body = this.children.map(function (child) {
        return child.renderRaw(-2);
      }).join('\n');

      if (tag === 'style') {
        body = renderStylesheet(body);
      }

      childBody = childBody ? childBody.replace(new RegExp("^<".concat(tag, ">")), '').replace(new RegExp("</".concat(tag, ">$")), '') : '';
      return "<".concat(tag).concat(attrs ? ' ' + attrs : '', ">\n").concat(body).concat(childBody, "</").concat(tag, ">");
    }
  }]);

  return Inject;
}();

module.exports = Inject;