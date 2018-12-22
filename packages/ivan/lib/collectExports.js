"use strict";

var collectExports = function collectExports(files) {
  var exports = files.reduce(function (result, file) {
    return result.concat(file.transpiledFile.filter(function (cmd) {
      return cmd.type === 'export';
    }));
  }, []);
  return exports;
};

module.exports = collectExports;