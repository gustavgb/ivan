"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var LogHandler =
/*#__PURE__*/
function () {
  function LogHandler() {
    _classCallCheck(this, LogHandler);

    this.logs = [];
  }

  _createClass(LogHandler, [{
    key: "log",
    value: function log(msg) {
      this.logs.push("Log at time ".concat(new Date(Date.now()).toISOString(), ":\n\n").concat(msg));
    }
  }, {
    key: "writeLogs",
    value: function writeLogs() {
      fs.writeFileSync('log.json', this.logs.join('\n\n'));
    }
  }]);

  return LogHandler;
}();

module.exports = new LogHandler();