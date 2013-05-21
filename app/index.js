'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var globule = require('globule');
var shelljs = require('shelljs');
var yeoman = require('yeoman-generator');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  var dependenciesInstalled = ['bundle', 'ruby'].every(function (depend) {
    return shelljs.which(depend);
  });

  // Make sure Ruby dependencies are installed, or exit
  if (!dependenciesInstalled) {
    console.log('Looks like you\'re missing some dependencies.' +
      '\nMake sure ' + 'Ruby'.white + ' and the ' + 'Bundler gem'.white +
      ' are installed, then run again.');
    shelljs.exit(1);
  }

  // Specify an appname from the command line, or use the parent directory name
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());

  // Default asset dirs to use for scaffolding
  this.defaultDirs = {
    css: 'css',
    js: 'js',
    img: 'image',
    font: 'webfont',
    cssPre: '_scss',
    jsPre: '_coffee',
    jekTmp: path.join(this.env.cwd, '.jekTmp')
  };
  this.jekTmpDir = this.defaultDirs.jekTmp;

  // Get user info from .gitconfig if available
  this.gitInfo = {
    name: shelljs.exec('git config user.name', {silent: true}).output.replace(/\n/g, ''),
    email: shelljs.exec('git config user.email', {silent: true}).output.replace(/\n/g, ''),
    github: shelljs.exec('git config github.user', {silent: true}).output.replace(/\n/g, ''),
  };

  // Get package.json for templating
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

  // subgenerator
  // this.hookFor('jekyll:subGen', {
  //   args: args
  // });

  this.on('end', function () {

    // Clean up temp files
    spawn('rm', ['-r', this.jekTmpDir], { stdio: 'inherit' });

    // Install Grunt and Bower dependencies
    // RWRW This should work now, as long as package and bower are there.
    //   console.log('\n\nI\'m all done. Running ' + 'npm install & bower install'.bold.yellow + ' to install the required dependencies. If this fails, try running the command yourself.\n\n');
    // RWRW OR easier, use underscore in bower.json with this.installDependencies in on end callback for depens.
    // this.installDependencies({ skipInstall: options['skip-install'] });

    // RWRW Remember to alert that the files in prep dir are just css, and need to
    // be preprocessed up
    // coffee can overwrite js
    // Display BP version (4.2.0)
    // Alert which port your preview server is on :9000

  });
};

util.inherits(Generator, yeoman.generators.NamedBase);

////////////////////////// User input ////////////////////////////

// TODO: When new prompt library lands:
//   Rewrite for cleaner conditional prompts
//   Auto populate with magicDefaults
//   Use select and boolean prompt types
//   Add custom validation
//   Make some defaults editable with an equivalent of read module's `edit`

// Author information
Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log('This generator will scaffold and wire a Jekyll site. Yo, Jekyll!'.yellow.bold +
    '\n\nTell us a little about yourself.'.yellow + ' ☛');

  var prompts = [{
    name: 'author',
    message: 'Name:',
    default: this.gitInfo.name
  },
  {
    name: 'email',
    message: 'Email:',
    default: this.gitInfo.email
  },
  {
    name: 'github',
    message: 'GitHub Username:',
    default: this.gitInfo.github
  },
  {
    name: 'twitter',
    message: 'Twitter Username:',
    default: '@' + this.gitInfo.github
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    // Assign prompt results to Generator object
    this.author  = props.author;
    this.email   = props.email;
    this.github  = props.github;
    this.twitter = props.twitter[0] === '@' ? props.twitter.substr(1) : props.twitter;

    cb();
  }.bind(this));
};

// Basic direcory structure
Generator.prototype.askForStructure = function askForStructure() {
  var cb = this.async();

  console.log('\nSet up some directories.'.yellow + ' ☛' +
    '\nNested directories are fine.');

  var prompts = [{
    name: 'cssDir',
    message: 'Choose a css directory:',
    default: this.defaultDirs.css
    // Required, edit
  },
  {
    name: 'jsDir',
    message: 'Choose a javascript directory:',
    default: this.defaultDirs.js
    // Required, edit
  },
  {
    name: 'imgDir',
    message: 'Choose an image file directory:',
    default: this.defaultDirs.img
    // Required, edit
  },
  {
    name: 'fontDir',
    message: 'Choose a webfont directory:',
    default: this.defaultDirs.font
    // Required, edit
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    // Assign prompt results to Generator object
    // Trim leading and trailing /'s for use in underscore templates
    this.cssDir = props.cssDir.replace(/^\/*|\/*$/g, '');
    this.jsDir  = props.jsDir.replace(/^\/*|\/*$/g, '');
    this.imgDir = props.imgDir.replace(/^\/*|\/*$/g, '');
    this.fontDir = props.fontDir.replace(/^\/*|\/*$/g, '');

    cb();
  }.bind(this));
};

// Preprocessors and libraries
// TODO: Add Stylus
Generator.prototype.askForTools = function askFor() {
  var cb = this.async();

  // Multiple select options
  var cssPreOptions = {
    s: 'sass',
    c: 'compass',
    n: 'none'
  };
  var jsPreOptions  = {
    c: 'coffeescript',
    n: 'none'
  };

  console.log('\nWire tools and preprocessors.'.yellow + ' ☛');

  var prompts = [{
    name: 'cssPre',
    message: 'Use a css preprocessor?\n s: Sass\n c: Sass & Compass\n n: none',
    default: 'n'
  },
  {
    name: 'jsPre',
    message: 'Use a javascript preprocessor?\n c: Coffeescript\n n: none',
    default: 'n',
  }
  // {
  //   name: 'requireJs',
  //   message: 'Use Require.js?',
  //   default: 'y/N'
  // }
  ];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    // Assign prompt results to Generator object
    // this.requireJs  = !(/n/i).test(props.requireJs);

    // Multiple choice 'none' to false
    this.cssPre    = (/n/i).test(props.cssPre) ? false : cssPreOptions[props.cssPre];
    this.jsPre     = (/n/i).test(props.jsPre)  ? false : jsPreOptions[props.jsPre];

    cb();
  }.bind(this));
};

// Css Preprocessor conditional prompts
Generator.prototype.askForCssPre = function askFor() {
  if (this.cssPre) {
    var cb = this.async();

    var prompts = [{
      name: 'cssPreDir',
      message: 'Choose a css preprocessor directory:',
      default: this.defaultDirs.cssPre
    }];

    this.prompt(prompts, function (err, props) {
      if (err) {
        return this.emit('error', err);
      }

      // Assign prompt results to Generator object
      // Trim leading and trailing /'s for use in underscore templates
      this.cssPreDir = props.cssPreDir.replace(/^\/*|\/*$/g, '');

      cb();
    }.bind(this));
  }
  else {
    this.cssPreDir       = false;
  }
}

// Javascript Preprocessor conditional prompts
Generator.prototype.askForJsPre = function askFor() {
  if (this.jsPre) {
    var cb = this.async();

    var prompts = [{
      name: 'jsPreDir',
      message: 'Choose a javascript preprocessor directory:',
      default: this.defaultDirs.jsPre
    }];

    this.prompt(prompts, function (err, props) {
      if (err) {
        return this.emit('error', err);
      }

      // Assign prompt results to Generator object
      // Trim leading and trailing /'s for use in underscore templates
      this.jsPreDir  = props.jsPreDir.replace(/^\/*|\/*$/g, '');

      cb();
    }.bind(this));
  }
  else {
    this.jsPreDir       = false;
  }
}

// Jekyll boilerplate templates
// TODO: Make template choices extensible
Generator.prototype.askForTemplates = function askFor() {
  var cb = this.async();

  // Multiple select options
  var templateTypeOptions = {
    d: 'default',
    h5: 'h5bp'
  };

  console.log('\nChoose a template.'.yellow + ' ☛');

  var prompts = [{
    name: 'templateType',
    message: 'Choose a Jekyll site template\n d:  Default\n h5: HTML5 ★ Boilerplate',
    default: 'd'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    // Assign prompt results to Generator object
    this.templateType = templateTypeOptions[props.templateType];

    cb();
  }.bind(this));
};

// h5bp conditional prompts
Generator.prototype.askForh5bp = function askFor() {
  if (this.templateType === 'h5bp') {
    var cb = this.async();

    var prompts = [{
      name: 'h5bpCss',
      message: 'Add H5★BP css files?',
      default: 'Y/n'
    },
    {
      name: 'h5bpJs',
      message: 'Add H5★BP javascript files?',
      default: 'Y/n'
    },
    {
      name: 'h5bpIco',
      message: 'Add H5★BP favorite and touch icons?',
      default: 'y/N'
    },
    {
      name: 'h5bpDocs',
      message: 'Add H5★BP documentation?',
      default: 'y/N'
    },
    {
      name: 'h5bpAnalytics',
      message: 'Include Google Analytics?',
      default: 'y/N'
    }];

    this.prompt(prompts, function (err, props) {
      if (err) {
        return this.emit('error', err);
      }

      // Assign prompt results to Generator object
      this.h5bpCss       = (/y/i).test(props.h5bpCss);
      this.h5bpJs        = (/y/i).test(props.h5bpJs);
      this.h5bpIco       = !(/n/i).test(props.h5bpIco);
      this.h5bpDocs      = !(/n/i).test(props.h5bpDocs);
      this.h5bpAnalytics = !(/n/i).test(props.h5bpAnalytics);

      cb();
    }.bind(this));
  }
  else {
    this.h5bpCss       = false;
    this.h5bpJs        = false;
    this.h5bpIco       = false;
    this.h5bpDocs      = false;
    this.h5bpAnalytics = false;
  }
};

// Jekyll configuration
Generator.prototype.askForJekyll = function askFor() {
  var cb = this.async();

  // Multiple select options
  var jekPostOptions = {
    d: 'date',
    p: 'pretty',
    n: 'none'
  };
  var jekMkdOptions = {
    m:  'maruku',
    rd: 'rdiscount',
    k:  'kramdown',
    rc: 'redcarpet'
  };

  console.log('\nAnd configure Jekyll.'.yellow + ' ☛' +
              '\nYou can change all of these options in Jekyll\'s config.yml.');

  var prompts = [{
    name: 'jekDescript',
    message: 'Site Description:'
  },
  {
    // TODO: Add handling for custom formats
    name: 'jekPost',
    message: 'Choose a post permalink style\n d: date\n p: pretty\n n: none\n',
    default: 'd'
  },
  {
    name: 'jekMkd',
    message: 'Markdown library \n m:  maruku\n rd: rdiscount\n k:  kramdown\n rc: redcarpet\n',
    default: 'm',
  },
  {
    name: 'jekPyg',
    message: 'Use the Pygments code highlighting library?',
    default: 'y/N'
  },
  {
    name: 'jekPage',
    message: 'How many posts should be shown on the home page?',
    default: '# of posts/All'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    // Assign prompt results to Generator object
    this.jekPyg      = !(/n/i).test(props.jekPyg);

    this.jekMkd      = jekMkdOptions[props.jekMkd];
    this.jekPost     = jekPostOptions[props.jekPost];

    // String properties without defaults to string or boolean
    this.jekDescript = props.jekDescript !== '' ? props.jekDescript : false;
    this.jekPage     = props.jekPage     !== '# of posts/All' ? 'all' : props.jekPage.toLowerCase;

    cb();
  }.bind(this));
};

////////////////////////// Generate App //////////////////////////

Generator.prototype.rubyDependencies = function rubyDependencies() {
  this.template('Gemfile');
  this.conflicter.resolve(function (err) {
    if (err) {
      return this.emit('error', err);
    }
    shelljs.exec('bundle install');
  });
};

Generator.prototype.initJekyll = function initJekyll() {

  // Create a default Jekyll site in a temporary folder
  shelljs.exec('bundle exec jekyll new ' + this.jekTmpDir);
};

Generator.prototype.directories = function directories() {

  // Scaffold Jekyll dirs
  this.mkdir(path.join('app', this.cssDir));
  this.mkdir(path.join('app', this.jsDir));
  this.mkdir(path.join('app', this.imgDir));
  this.mkdir(path.join('app', this.fontDir));
  this.mkdir('app/_layouts');
  this.mkdir('app/_posts');
  this.mkdir('app/_includes');
  this.mkdir('app/_plugins');
};

Generator.prototype.templates = function templates() {

  // Build formatted date for posts
  var date = new Date();
  var formattedDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

  // Universal template files
  this.copy(path.join(this.jekTmpDir, '_posts', formattedDate + '-welcome-to-jekyll.markdown'), path.join('app/_posts', formattedDate + '-welcome-to-jekyll.md'));
  // RWRW write template
  this.template('app/_posts/0000-00-00-yo-jekyll.md', 'app/_posts/' + formattedDate + '-yo-jekyll.md');

  // Default Jekyll templates
  if (this.templateType === 'default') {

    // From cli generated Jekyll site
    this.copy(path.join(this.jekTmpDir, 'index.html'), 'app/index.html');
    this.copy(path.join(this.jekTmpDir, '_layouts/post.html'), 'app/_layouts/post.html');
    this.copy(path.join(this.jekTmpDir, 'css/main.css'), path.join('app', this.cssDir, 'main.css'));

    // From generator. Altered for Jekyll templating and Yeoman tasks.
    this.template('conditional/template-default/_layouts/default.html', 'app/_layouts/default.html');
  }

  // HTML5 Boilerplate templates
  else if (this.templateType === 'h5bp') {

    // Pull in the latest stable of h5bp
    var cb = this.async();

    this.remote('h5bp', 'html5-boilerplate', 'v4.2.0', function (err, remote) {
      if (err) {
        return cb(err);
      }

      // TODO: Get the remote cache location and use globbule to select and
      // copy files less fragily.

      // From h5bp git repo
      // Universal
      remote.copy('.htaccess', 'app/.htaccess');
      remote.copy('404.html', 'app/404.html');
      remote.copy('crossdomain.xml', 'app/crossdomain.xml');
      remote.copy('LICENSE.md', 'app/_h5bp-docs/LICENSE.md');
      remote.copy('robots.txt', 'app/robots.txt');

      // Css boilerplate
      if (this.h5bpCss) {
        remote.directory('css', path.join('app', this.cssDir));
      }
      else {
        this.write(path.join('app', this.cssDir, 'main.css'), '');
      }

      // Js boilerplate
      // Ignore vendor diectory because we're handling components with Bower
      if (this.h5bpJs) {
        remote.copy('js/main.js', path.join('app', this.jsDir, 'main.js'));
        remote.copy('js/plugins.js', path.join('app', this.jsDir, 'plugins.js'));
      }
      else {
        this.write(path.join('app', this.jsDir, 'main.js'), '');
      }

      // Touch and favicons
      if (this.h5bpIco) {
        remote.copy('apple-touch-icon-114x114-precomposed.png', 'app/apple-touch-icon-114x114-precomposed.png');
        remote.copy('apple-touch-icon-144x144-precomposed.png', 'app/apple-touch-icon-144x144-precomposed.png');
        remote.copy('apple-touch-icon-57x57-precomposed.png', 'app/apple-touch-icon-57x57-precomposed.png');
        remote.copy('apple-touch-icon-72x72-precomposed.png', 'app/apple-touch-icon-72x72-precomposed.png');
        remote.copy('apple-touch-icon-precomposed.png', 'app/apple-touch-icon-precomposed.png');
        remote.copy('apple-touch-icon.png', 'app/apple-touch-icon.png');
        remote.copy('favicon.ico', 'app/favicon.ico');
      }

      // Docs
      if (this.h5bpDocs) {
        remote.directory('doc', 'app/_h5bp-docs/code-docs');
        remote.copy('CHANGELOG.md', 'app/_h5bp-docs/CHANGELOG.md');
        remote.copy('CONTRIBUTING.md', 'app/_h5bp-docs/CONTRIBUTING.md');
        remote.copy('README.md', 'app/_h5bp-docs/README.md');
      }

      cb();
    }.bind(this));

    // From generator. Files altered for Jekyll templating and Yeoman tasks.
    // Universal
    this.copy('conditional/template-h5bp/index.html', 'app/index.html');
    this.copy('conditional/template-h5bp/_layouts/post.html', 'app/_layouts/post.html');
    this.template('conditional/template-h5bp/humans.txt', 'app/humans.txt');
    this.template('conditional/template-h5bp/_includes/scripts.html', 'app/_includes/scripts.html');
    this.template('conditional/template-h5bp/_layouts/default.html', 'app/_layouts/default.html');

    // Google analytincs include
    if (this.h5bpAnalytics) {
      this.copy('conditional/template-h5bp/_includes/googleanalytics.html', 'app/_includes/googleanalytics.html');
    }
  }
};

Generator.prototype.git = function git() {
  this.template('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

Generator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.template('_bower.json', 'bower.json');
};

Generator.prototype.gruntfile = function gruntfile() {
  // RWRW write template
  // this.template('Gruntfile.js');
};

Generator.prototype.packageJSON = function packageJSON() {
  // RWRW write template
  // this.template('_package.json', 'package.json');
};

Generator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

Generator.prototype.editor = function editor() {
  this.copy('editorconfig', '.editorconfig');
};

Generator.prototype.jekFiles = function jekFiles() {

  // Jekyll config files
  this.copy('_config.build.yml', '_config.build.yml');
  this.template('_config.yml');

  // Pygments styles
  if (this.jekPyg) {
    this.copy(path.join(this.jekTmpDir, 'css/syntax.css'), path.join('app', this.cssDir, 'syntax.css'));
  }
};

Generator.prototype.cssPreprocessor = function cssPreprocessor() {
  if (this.cssPre) {
    this.mkdir(path.join('app', this.cssPreDir));
  }

  // Sass and Compass
  if (['sass', 'compass'].indexOf(this.cssPre) !== -1) {

    this.template('conditional/sass/readme.md', path.join('app', this.cssPreDir, 'readme.md'));

    // Move css files to scss files
    var files = globule.find('**/*.css', {srcBase: path.join('app', this.cssDir)});

    files.forEach(function (file) {
      this.copy(path.join('../../../../app', this.cssDir, file),
                path.join('app', this.cssPreDir, file.replace(/\.css$/, '.scss')));

      // Cleanup old css files
      spawn('rm', ['-f', path.join('app', this.cssDir, file)], { stdio: 'inherit' });
    }, this);
  }
  if (this.cssPre === 'compass') {
    this.template('conditional/compass/config.rb', 'config.rb');
  }
};

Generator.prototype.jsPreprocessor = function jsPreprocessor() {
  if (this.jsPre) {
    this.mkdir(path.join('app', this.jsPreDir));
  }

  // Coffeescript
  if (this.jsPre === 'coffeescript') {
    this.template('conditional/coffee/readme.md', path.join('app', this.jsPreDir, 'readme.md'));

  // TODO: Translate and move js files to coffee files using js2coffee
  }
};


//////////////////////////////////////////////////////////
// TODO: These ↓

// Generator.prototype.requireJs = function requireJs() {
// };

// Generator.prototype.testing = function testing() {
// };

// TODO: Categories subgenerator (?)
// TODO: yo arg for json file with all config in it.
// TODO: Configural downloads to the _plugins dir.

// TODO: Do references to the 'app' directory need to be made configurable?
// See generator-angular.

/////////////////
// RWRW NOTES

// End with a list of commands and description
// all components managed with Bower
