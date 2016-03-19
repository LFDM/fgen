/* eslint-disable indent */
/* eslint-disable no-console */

var _ = require('lodash');
var fs = require('fs');
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
      console.log('Unable to read template at ' + instr.template);
      return;
    }
    var file = f.toString();
    var templateOptions = { interpolate: generator.interpolator };
    var interpolated = _.template(file, templateOptions)(instr.interpolator);
    fs.writeFile(instr.path, interpolated, function(writeErr) {
      if (writeErr) {
        console.log('Unable to write file at ' + instr.path);
        return;
      }
      console.log('File created at ' + instr.path);
    });
  });
}

module.exports = generator;
