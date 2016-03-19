var _ = require('lodash');
var fs = require('fs');
var yargs = require('yargs');

var registry = [];

var defaults = {
  base: __dirname,
  current: __dirname,
  interpolator: /{{([\s\S]+?)}}/g,
};

var generator = {
  base: defaults.base,
  current: defaults.current,
  interpolator: defaults.interpolator,
  register: register,
  process: process
};

function register(conf) {
  registry.push(conf);
  yargs.command(conf.command, conf.description);
}

function process() {
  var argv = yargs.argv;
  var command = argv._[0];
  for (var i = 0; i < registry.length; i++) {
    var conf = registry[i];
    if (command === conf.command) {
      var instructions = conf.onMatch(argv, generator.base, generator.current);
      _.forEach(instructions, processInstruction);
      return;
    }
  }
  yargs.showHelp();
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
