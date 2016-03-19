var path = require('path');
var _ = require('lodash');


module.exports = {
  command: 'component <name> [options]',
  description: 'Create a component, optionally with a container and a pure presenter',
  options: {
    container: {
      alias: 'c',
      describe: 'Create a redux container'
    },
    presenter: {
      alias: 'P',
      describe: 'Create presenter component'
    },
    purePresenter: {
      alias: 'p',
      describe: 'Create a pure presenter component'
    },
    style: {
      alias: 's',
      describe: 'Create a stylesheet file'
    }
  },
  onMatch: function(argv, paths) {
    var presenterTpl = argv.p ? 'presenter-pure.tpl' : 'presenter.tpl';
    var name = argv.name;
    var folder= path.join(paths.base, 'components', name);
    var interpolator = { name: name, cssName: _.kebabCase(name) };

    function toAction(tplPath, outputPath) {
      return {
        interpolator: interpolator,
        template: path.join(__dirname, tplPath),
        path: path.join(folder, outputPath),
      };
    }

    var actions = {
      purePresenter: toAction('presenter-pure.tpl', 'presenter.js'),
      presenter: toAction('presenter.tpl', 'presenter.js'),
      container: toAction('container.tpl', 'index.js'),
      style: toAction('style.tpl', 'style.less')
    };

    return _.reduce(actions, function(mem, action, name) {
      console.log(argv, name, argv[name]);
      if (argv[name]) {
        mem.push(action);
      }
      return mem;
    }, []);
  }
}
