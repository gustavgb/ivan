"use strict";

var glob = require('glob');

var fs = require('fs-extra');

var parseFile = require('./parseFile');

var transpile = require('./transpile');

var collectExports = require('./collectExports');

var renderMarkup = require('./renderMarkup');

var processFiles = function processFiles(pages, components) {
  return pages.map(function (file) {
    var content = fs.readFileSync(file, 'utf8');

    try {
      var fileTree = parseFile(content);
      var transpiledFile = transpile(fileTree);
      return {
        src: file,
        transpiledFile: transpiledFile
      };
    } catch (e) {
      throw new Error("".concat(e.message, " (").concat(file, ")"));
    }
  });
};

var parseFileName = function parseFileName(name) {
  return name.split('/').reduce(function (a, val) {
    return val;
  }).replace('.ivan', '');
};

var parseFileDir = function parseFileDir(name) {
  return name.split('pages/')[1].split('/').reduce(function (a, val, index, list) {
    if (index < list.length - 1) {
      return val;
    } else {
      return a;
    }
  }, '');
};

var writeOutput = function writeOutput(sourceFileName, content) {
  var extension = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.html';
  var fileName = parseFileName(sourceFileName);
  var fileDir = parseFileDir(sourceFileName);
  if (fileDir.length > 0) fileDir += '/';

  if (fileName !== 'index') {
    fs.emptyDirSync('dist/' + fileDir + fileName);
    fs.writeFileSync("dist/".concat(fileDir).concat(fileName, "/index").concat(extension), content, 'utf8');
    console.log("Saving ".concat(fileDir).concat(fileName, "/index").concat(extension));
  } else {
    fs.writeFileSync("dist/".concat(fileDir).concat(fileName).concat(extension), content, 'utf8');
    console.log("Saving ".concat(fileDir).concat(fileName).concat(extension));
  }
};

var compile = function compile(sourceDir) {
  fs.emptyDirSync('dist');
  var pagePaths = [];
  var pagePrefix = new RegExp("^".concat(sourceDir, "/pages"));
  var filePaths = glob.sync(sourceDir + '/!(static)/**/*.ivan').filter(function (file) {
    if (pagePrefix.test(file)) {
      pagePaths.push(file);
      return false;
    }

    return true;
  });
  console.log('Compiling pages:\n  - ' + [].concat(filePaths, pagePaths).join('\n  - '));
  var files = processFiles(filePaths);
  var pages = processFiles(pagePaths);
  var globals = collectExports(files);
  pages.forEach(function (fileObj) {
    try {
      var markup = fileObj.transpiledFile.filter(function (el) {
        return el.entry;
      })[0].render(globals);
      var formattedMarkup = renderMarkup(markup);
      writeOutput(fileObj.src, formattedMarkup);
    } catch (e) {
      throw new Error("".concat(e.message, " (").concat(fileObj.src, ")"));
    }
  });

  if (fs.pathExistsSync(sourceDir + '/static')) {
    fs.copySync(sourceDir + '/static', 'dist');
  }
};

module.exports = compile;