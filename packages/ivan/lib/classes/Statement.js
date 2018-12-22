"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Statement =
/*#__PURE__*/
function () {
  function Statement(indentation, lineContent, children) {
    _classCallCheck(this, Statement);

    this.indentation = indentation;
    this.lineContent = lineContent;

    if (lineContent !== 'root') {
      var body = null;
      var bodyArgs = null;
      var commandArgs = null;
      var inString = false;

      for (var i = 0; i < lineContent.length; i++) {
        var c = lineContent[i];

        if (c === '"') {
          inString = !inString;
        }

        if (!inString && c === ':') {
          commandArgs = lineContent.substring(0, i).split(' ');
          body = lineContent.substring(i + 1);
          bodyArgs = body.replace(/^\s{1,}/, '').replace(/\s{1,}$/, '').split(' ');
          break;
        }
      }

      this.commandArgs = commandArgs || lineContent.split(' ');
      this.body = body || '';
      this.bodyArgs = bodyArgs || '';
    } else {
      this.isRoot = true;
    }

    this.children = children;
  }

  _createClass(Statement, [{
    key: "getWithoutFirstCommand",
    value: function getWithoutFirstCommand() {
      if (this.isRoot) {
        return this;
      }

      var lineContent = this.commandArgs.slice(1).join(' ') + (this.body ? ':' + this.body : '');
      return new Statement(this.indentation, lineContent, this.children);
    }
  }]);

  return Statement;
}();

module.exports = Statement;