### ftemp

Lightweight utility tool to create a template based file generator CLI


## Install

```
npm install ftemp --save-dev
```

## Usage


Given a file called `generate.js`, which runs `ftemp`

```javascript

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


Check out the `examples` folder for a more elaborate use case.
The example script is exposed as `npm run` script in this repository, so
you can try

```
npm run -s generate -- component
```


## API Docs

#### `ftemp.register(conf1, [conf2, conf3, ...])`

`register` is a wrapper around [yargs](http://yargs.js.org/).
Configuration objects have the following shape:

```
{
  command: String,
  description: String,
  options: Object,
  onMatch: Function(argv, paths) -> List<Instruction>
}
```

`onMatch` needs to return a list of Instructions - each Instruction will
create a file.

```
{
  interpolator: Object, // Values used within the template
  template: String, // path to a template file
  path: String // path of the file to generate
}
```

#### `ftemp.run()`

Invoke at the end of your `ftemp` script

#### `ftemp.paths`

Helper paths, which are passed to the `onMatch` function.

Comes with two defaults:
```
{
  base: String // current working directory
  current: String // current working directory
}
```
