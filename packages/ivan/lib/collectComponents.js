"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var collectComponents = function collectComponents(transpiledFile, globals) {
  var imports = transpiledFile.filter(function (el) {
    return el.type === 'import';
  }).map(function (imp) {
    var component = globals.filter(function (g) {
      return g.name === imp.name;
    })[0];

    if (!component) {
      throw new Error('Import "' + imp.name + '" invalid. Component not exported anywhere');
    }

    return {
      component: component,
      mapTo: imp.mapTo || imp.name
    };
  });
  var importIndex = imports.reduce(function (acc, imp) {
    return Object.assign(acc, _defineProperty({}, imp.mapTo, imp.component));
  }, {});
  var fileIndex = transpiledFile.filter(function (a) {
    return !!a.name && (a.type === 'component' || a.type === 'export');
  }).reduce(function (acc, el) {
    return Object.assign(acc, _defineProperty({}, el.name, el));
  }, {});
  return Object.assign({}, importIndex, fileIndex);
};

module.exports = collectComponents;