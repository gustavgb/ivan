"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Import = function Import(name, mapTo) {
  _classCallCheck(this, Import);

  this.name = name;
  this.mapTo = mapTo;
  this.type = 'import';
};

module.exports = Import;