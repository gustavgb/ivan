"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Statement = require('./classes/Statement');

var Section =
/*#__PURE__*/
function () {
  function Section(indent, content) {
    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, Section);

    this.indent = indent;
    this.content = content;
    this.parent = parent;
    this.children = [];
  }

  _createClass(Section, [{
    key: "addChild",
    value: function addChild(child) {
      this.children.push(child);
    }
  }]);

  return Section;
}();

var createStatements = function createStatements(section) {
  return new Statement(section.indent, section.content, section.children.map(createStatements));
};

var deepenStructure = function deepenStructure(lines) {
  var root = new Section(-1, 'root');
  var head = root;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    if (line.indent > head.indent) {
      var s = new Section(line.indent, line.content, head);
      head.addChild(s);
      head = s;
    } else if (line.indent === head.indent) {
      var _s = new Section(line.indent, line.content, head.parent);

      head.parent.addChild(_s);
      head = _s;
    } else {
      while (line.indent < head.indent) {
        head = head.parent;
      }

      var _s2 = new Section(line.indent, line.content, head.parent);

      head.parent.addChild(_s2);
      head = _s2;
    }
  }

  return createStatements(root);
};

var parseFile = function parseFile(raw) {
  var lines = raw.split('\n').map(function (line) {
    var indent = 0;

    for (var i = 0; i < line.length; i++) {
      if (line[i] === ' ') {
        indent++;
      } else {
        break;
      }
    }

    var el = {
      indent: indent,
      content: line.substr(indent)
    };
    return el;
  }).filter(function (el) {
    return el.content;
  });
  var root = deepenStructure(lines);
  return root;
};

module.exports = parseFile;