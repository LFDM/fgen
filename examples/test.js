#!/usr/bin/env node
var generator = require('../');
var path = require('path');

var componentPlugin = require('./plugins/component');

generator.register(componentPlugin);

generator.paths.base = path.join(__dirname, 'dest');
generator.run();

