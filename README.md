### ftemp

Lightweight utility tool to create a template based file generator CLI


## Install

```
npm install ftemp --save-dev
```

## Usage


Given this file `generate.js`, which runs `ftemp`

```

// generate.js

var ftemp = require('ftemp');
var path = require('path');

ftemp.paths.base = path.join(__dirname, 'src');
ftemp.paths.templates = path.join(__dirname, 'templates');

var testPlugin = {
  command: 'test <name>',
  description: 'Test ftemp',
  options: {
    shout: {
      alias: 's',
      describe: 'Uppercase the given name'
    }
  },
  onMatch: function(argv, paths) {
    var name = argv.shout ? argv.name.toUpperCase() : argv.name;
    return [
      {
        interpolator: { name: name },
        template: path.join(paths.templates, 'test.tpl'),
        path: path.join(paths.base, name, 'index.js')
      }
    ];
  }
};

ftemp.register(testPlugin);
ftemp.run();
```

and a template

```
// templates/test.tpl

Hello {{ name }}!
```

invoking

```
node generate.js test friend -s
```

will create a file at `src/friend/index.js` with the content `Hello
FRIEND!`

