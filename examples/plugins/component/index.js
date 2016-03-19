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
    var actions = [];
    console.log(argv);

    if (argv.purePresenter) {
      actions.push(
        {
          interpolator: interpolator,
          template: path.join(__dirname, 'presenter-pure.tpl'),
          path: path.join(folder, 'presenter.js')
        }
      );
    }
    if (argv.presenter) {
      actions.push(
        {
          interpolator: interpolator,
          template: path.join(__dirname, 'presenter.tpl'),
          path: path.join(folder, 'presenter.js')
        }
      );
    }
    if (argv.container) {
      actions.push({
        interpolator: interpolator,
        template: path.join(__dirname, 'container.tpl'),
        path: path.join(folder, 'index.js')
      })
    }
    if (argv.style) {
      actions.push({
        interpolator: interpolator,
        template: path.join(__dirname, 'style.tpl'),
        path: path.join(folder, 'style.less')
      })
    }

    return actions;
  }
}
