"use strict";

var Statement = require('./classes/Statement');

var Import = require('./classes/Import');

var Style = require('./classes/Style');

var Layout = require('./classes/Layout');

var Page = require('./classes/Page');

var Element = require('./classes/Element');

var Inject = require('./classes/Inject');

var mapChild = function mapChild(child) {
  return new Element(child.commandArgs[0], child.commandArgs.slice(1), child.body, child.bodyArgs, child.children.map(mapChild), child);
};

var handleCommand = function handleCommand(statement) {
  var commandArgs = statement.commandArgs;
  var bodyArgs = statement.bodyArgs;
  var children = statement.children.map(mapChild);

  switch (commandArgs[0]) {
    case 'export':
      {
        var element = handleCommand(statement.getWithoutFirstCommand());

        if (element.type !== 'component') {
          throw new Error('Exports must be components.');
        }

        element.type = 'export';
        return element;
      }

    case 'import':
      {
        var importName = commandArgs[1];
        return new Import(importName, bodyArgs[0]);
      }

    case 'inject':
      {
        var name = commandArgs[1];
        var props = bodyArgs.slice(1);
        var _element = bodyArgs[0];
        return new Inject(name, _element, props, children);
      }

    case 'style':
      {
        var componentName = commandArgs[1];

        var _props = bodyArgs.slice(1);

        var _element2 = bodyArgs[0];
        return new Style(componentName, _element2, _props, children);
      }

    case 'layout':
      {
        var _name = commandArgs[1];

        var _props2 = bodyArgs.slice(1);

        var _element3 = bodyArgs[0];
        return new Layout(_name, _element3, _props2, children);
      }

    case 'page':
      {
        return new Page(children);
      }

    default:
      return null;
  }
};

var transpile = function transpile(statement) {
  if (statement instanceof Statement && statement.isRoot) {
    var transpiledFile = statement.children.map(handleCommand);
    transpiledFile.forEach(function (child) {
      if (child instanceof Layout || child instanceof Page || child instanceof Style) {
        child.file = transpiledFile;
      }
    });
    return transpiledFile;
  } else {
    throw new Error('Invalid statement tree.');
  }
};

module.exports = transpile;