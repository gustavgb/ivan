"use strict";

var compile = require('./compile');

var nodeWatch = require('node-watch');

var compileWithTime = function compileWithTime(sourceDir) {
  var begin = Date.now();
  compileCatchErrors(sourceDir).then(function () {
    var delta = Date.now() - begin;
    console.log('Compiled in ' + delta + 'ms');
  }).catch(console.log);
};

var compileCatchErrors = function compileCatchErrors(sourceDir) {
  return new Promise(function (resolve, reject) {
    try {
      compile(sourceDir);
      resolve();
    } catch (e) {
      console.log('\n');
      reject(e);
    }
  });
};

var main = function main(sourceDir, _ref) {
  var _ref$watch = _ref.watch,
      watch = _ref$watch === void 0 ? false : _ref$watch;
  var timeout = null;
  var filesChanged = {};

  if (watch) {
    console.log('Watching for file changes');
    compileWithTime(sourceDir);
    nodeWatch('./' + sourceDir, {
      recursive: true
    }, function (event, fileName) {
      filesChanged[fileName] = true;

      if (!timeout) {
        timeout = setTimeout(function () {
          timeout = null;
          console.log('\nFiles changed: \n  - ' + Object.keys(filesChanged).join('\n  - '));
          filesChanged = {};
          compileWithTime(sourceDir);
        }, 300);
      }
    });
  } else {
    compileCatchErrors(sourceDir).catch(console.log);
  }
};

module.exports = main;