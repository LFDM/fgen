/* eslint-disable indent */
/* eslint-disable no-console */

var _ = require('lodash');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var yargs = require('yargs');

var defaults = {
  base: __dirname,
  current: __dirname,
  interpolator: /{{([\s\S]+?)}}/g,
};

var generator = {
  interpolator: defaults.interpolator,
  paths: {
    base: defaults.base,
    current: defaults.current,
  },
  register: register,
  process: process
};

function register() {
  _.forEach(arguments, function(conf) {
    yargs.command(conf.command, conf.description, conf.options, function(argv) {
        console.log('Invoking ' + argv._[0]);
        var instructions = conf.onMatch(argv, generator.paths);
        _.forEach(instructions, processInstruction);
    });
  });
}

function process() {
  if (yargs.argv._.length === 0) {
    yargs.showHelp();
  }
}

function processInstruction(instr) {
  fs.readFile(instr.template, function(readErr, f) {
    if (readErr) {
      logError('find template', instr.template);
      return;
    }
    var file = f.toString();
    var templateOptions = { interpolate: generator.interpolator };
    var interpolated = _.template(file, templateOptions)(instr.interpolator);
    var dirname = path.dirname(instr.path);

    mkdirp(dirname, function(dirErr) {
      if (dirErr) {
        logError('create directory', dirname);
        return;
      }

      fs.writeFile(instr.path, interpolated, function(writeErr) {
        if (writeErr) {
          logError('write file', instr.path);
          return;
        }
        logSuccess(instr.path);
      });
    });
  });
}

function logError(type, atPath) {
  console.log('Unable to ' + type + ' at ' + atPath);
}

function logSuccess(atPath) {
  console.log('File created at ' + atPath);
}

module.exports = generator;
