'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var execSync = require('execSync');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  // Specify an appname from the command line, or use dir name
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());

  // TODO: Do references to the 'app' directory need to be made configurable?
  // See generator-angular.

  // RWRW Attempt to get user's gitconfig name. Doesn't work.
  // var nameDefault = exec('git config user.name', function (err, stdout) {
  //   if (err) {
  //     return 'breb smath';
  //   }
  //   return stdout;
  // });

  // var args = ['main'];

  // Default asset dirs to use for scaffolding
  // TODO: detect dirs for a dropped in Jekyll site?
  this.defaultDirs = {
    css: 'css',
    js: 'js',
    img: 'image',
    cssPre: '_scss',
    jsPre: '_coffee',
    tmpJek: path.join(this.env.cwd, '.tmpJek')
  };

  // subgenerator
  // this.hookFor('jekyll:subGen', {
  //   args: args
  // });

  // Set permanant opts here
  // var someVar = 'gar';

  // RWRW This should work now, as long as package and bower are there.
  // this.on('end', function () {
  //   console.log('\n\nI\'m all done. Running ' + 'npm install & bower install'.bold.yellow + ' to install the required dependencies. If this fails, try running the command yourself.\n\n');
  //   spawn('npm', ['install'], { stdio: 'inherit' });
  //   spawn('bower', ['install'], { stdio: 'inherit' });
  // });

  // Bower install from new yo docs

  // !! RWRW use underscore in bower.json and this.installDependencies in on end callback.
  // "Alternatively they can install with" this.bowerInstall(['jquery', 'underscore'], { save: true });

  // Or...
  // this.on('end', function () {
  //   this.installDependencies({ skipInstall: options['skip-install'] });
  // });

  // RWRW
  // this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));


  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(Generator, yeoman.generators.NamedBase);

////////////////////////// User input ////////////////////////////

// TODO: When new prompt library lands in Yeoman 1.0:
//   Rewrite for conditional prompts
//   Auto populate with magicDefaults
//   Make some prompts required
//   Add custom validation
//   Make defaults editable with an equivalent of read module's edit: true

// Basic direcory structure
Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log(
    'This generator will scaffold and wire a Jekyll site. Yo, Jekyll!'.yellow.bold +
    '\n ' +
    '\nLet\'s set up some directories.'.yellow + ' ☛'
  );

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
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    // Assign prompt results to Generator object
    // String properties
    this.cssDir = props.cssDir;
    this.jsDir  = props.jsDir;
    this.imgDir = props.imgDir;

    cb();
  }.bind(this));
};

// Preprocessors and libraries
Generator.prototype.askForTools = function askFor() {
  var cb = this.async();

  // Multiple choice options
  // var cssPreOptions = ['s','c','n'];
  // var jsPreOptions  = ['c','n'];

  console.log('\nWire tools and preprocessors.'.yellow + ' ☛');

  var prompts = [{
    name: 'cssPre',
    message: 'Use a css preprocessor?\n s: Sass\n c: Sass & Compass\n n: none',
    default: 'n'
  },
  {
    name: 'cssPreDir',
    message: 'If so, choose a css preprocessor directory:',
    default: this.defaultDirs.cssPre
    // if above, Required, edit
  },
  {
    name: 'jsPre',
    message: 'Use a javascript preprocessor?\n c: Coffeescript\n n: none',
    default: 'n',
  },
  {
    name: 'jsPreDir',
    message: 'If so, choose a javascript preprocessor directory:',
    default: this.defaultDirs.jsPre
    // if above, Required, edit
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
    // Default y/N answer to boolean
    // this.requireJs  = !(/n/i).test(props.requireJs);

    // Multiple choice 'none' to false
    this.cssPre    = (/n/i).test(props.cssPre) ? false : props.cssPre;
    this.jsPre     = (/n/i).test(props.jsPre)  ? false : props.jsPre;

    // String properties
    this.cssPreDir = props.cssPreDir;
    this.jsPreDir  = props.jsPreDir;

    cb();
  }.bind(this));
};

// Jekyll boilerplate templates
// TODO: Add blank template
Generator.prototype.askForTemplates = function askFor() {
  var cb = this.async();

  // Multiple choice options
  // var templateType = ['d','h5'];

  console.log('\nChoose a template.'.yellow + ' ☛');

  var prompts = [{
    name: 'templateType',
    message: 'Choose a Jekyll site template\n d:  Default\n h5: HTML5 ★ Boilerplate',
    default: 'd',
    warning: 'h5: Yo dog I heard you like boilerplates in your boilerplates...'
  },
  {
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
    // Default Y/n answer to boolean
    this.h5bpCss       = (/y/i).test(props.h5bpCss);
    this.h5bpJs        = (/y/i).test(props.h5bpJs);

    // Default y/N answer to boolean
    this.h5bpIco       = !(/n/i).test(props.h5bpIco);
    this.h5bpDocs      = !(/n/i).test(props.h5bpDocs);
    this.h5bpAnalytics = !(/n/i).test(props.h5bpAnalytics);

    // String properties
    this.templateType = props.templateType;

    cb();
  }.bind(this));
};

// Jekyll configuration
Generator.prototype.askForJekyll = function askFor() {
  var cb = this.async();

  // Multiple choice options
  // var jekPost = ['d','p','n'];
  // var jekMkd  = ['m','rd','k','rc'];

  console.log('\nAnd configure Jekyll.'.yellow + ' ☛');

  var prompts = [{
    name: 'jekAuthor',
    message: 'Your Name:'
   // RWRW default: nameDefault;
  },
  {
    name: 'jekEmail',
    message: 'Your Email:'
  },
  {
    name: 'jekTwit',
    message: 'Your @Twitter Username:'
  },
  {
    name: 'jekGHub',
    message: 'Your GitHub Username:'
  },
  {
    name: 'jekDescript',
    message: 'Site Description:'
  },
  {
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
    warning: 'You can change all of these options in Jekyll\'s config.yml.'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    // Assign prompt results to Generator object
    // Default y/N answer to boolean
    this.jekPyg      = !(/n/i).test(props.jekPyg);

    // String properties
    this.jekMkd      = props.jekMkd;
    this.jekPost     = props.jekPost;

    // String properties without defaults to string or boolean
    this.jekAuthor   = props.jekAuthor   !== '' ? props.jekAuthor   : false;
    this.jekEmail    = props.jekEmail    !== '' ? props.jekEmail    : false;
    this.jekTwit     = props.jekTwit     !== '' ? props.jekTwit     : false;
    this.jekGHub     = props.jekGHub     !== '' ? props.jekGHub     : false;
    this.jekDescript = props.jekDescript !== '' ? props.jekDescript : false;
    this.jekPage     = props.jekPage     !== '' ? props.jekPage     : false;

    cb();
  }.bind(this));
};

////////////////////////// Generate App //////////////////////////

Generator.prototype.defaultJekyll = function defaultJekyll() {
  // Create blank Jekyll site in app
  // Sync: must execute before other scaffolding (template, cssPre, pygments)
  execSync.exec('jekyll new ' + this.defaultDirs.tmpJek);
};

Generator.prototype.directories = function directories() {
  // Scaffold Jekyll dirs
  // Must block templates and cssPreprocessor
  this.mkdir('app/');
  this.mkdir(path.join('app', this.cssDir));
  this.mkdir(path.join('app', this.imgDir));
  this.mkdir(path.join('app', this.jsDir));
  this.mkdir('app/_layouts');
  this.mkdir('app/_posts');
  this.mkdir('app/_includes');
  this.mkdir('app/_plugins');

  console.log('\n RWRW dirs done'.white);
};

Generator.prototype.templates = function templates() {

  var date = (new Date()).toISOString().split('T')[0];

  // Universal template files
  this.copy(path.join(this.defaultDirs.tmpJek, '_posts', date + '-welcome-to-jekyll.markdown'), path.join('app/_posts', date + '-welcome-to-jekyll.md'));
  this.template('app/_posts/0000-00-00-yo-jekyll.md', path.join('app/_posts', date + '-yo-jekyll.md'));

  // Default Jekyll templates
  if (this.templateType === 'd') {

    // From generator
    // RWRW write template
    this.template('app-conditional/def-template/_layouts/default.html', 'app/_layouts/default.html');

    // From default Jekyll installation
    // TODO: Rewrite to use this.directory()/any whole directory import with a exclude filter.
    this.copy(path.join(this.defaultDirs.tmpJek, 'index.html'), 'app/index.html');
    this.copy(path.join(this.defaultDirs.tmpJek, '_layouts/post.html'), 'app/_layouts/post.html');
    this.copy(path.join(this.defaultDirs.tmpJek, 'css/screen.css'), path.join('app', this.cssDir, 'screen.css'));
    this.copy(path.join(this.defaultDirs.tmpJek, 'images/rss.png'), path.join('app', this.imgDir, 'rss.png'));
  }

  // HTML5 Boilerplate templates
  else if (this.templateType === 'h5') {

    // Universal H5BP files
    this.copy('app-conditional/h5-template/htaccess', 'app/.htaccess');
    this.copy('app-conditional/h5-template/404.html', 'app/404.html');
    this.copy('app-conditional/h5-template/crossdomain.xml', 'app/crossdomain.xml');
    this.copy('app-conditional/h5-template/index.html', 'app/index.html');
    this.copy('app-conditional/h5-template/robots.txt', 'app/robots.txt');
    this.template('app-conditional/h5-template/humans.txt', 'app/humans.txt');

    this.copy('app-conditional/h5-template/_layouts/post.html', 'app/_layouts/post.html');
    this.template('app-conditional/h5-template/_layouts/default.html', 'app/_layouts/default.html');

    // Css boilerplate
    if (this.h5bpCss) {
      this.directory('app-conditional/h5-template/css', path.join('app', this.cssDir));
    }

    // Js boilerplate
    if (this.h5bpJs) {
      this.directory('app-conditional/h5-template/js', path.join('app', this.jsDir));
      this.copy('app-conditional/h5-template/_includes/scripts.html', 'app/_includes/scripts.html');
    }

    // Touch and favicons
    if (this.h5bpIco) {
      this.directory('app-conditional/h5-template/icons', path.join('app'));
    }

    // Google analytincs include
    if (this.h5bpAnalytics) {
      this.copy('app-conditional/h5-template/_includes/googleanalytics.html', 'app/_includes/googleanalytics.html');
    }

    // Docs. Always include the license.
    if (this.h5bpDocs) {
      this.directory('app-conditional/h5-template/docs', 'app/_H5BP-docs');
    }
    else {
      this.copy('app-conditional/h5-template/docs/LICENSE.md', 'app/_H5BP-docs/LICENSE.md');
    }
  }
};

Generator.prototype.gruntfile = function gruntfile() {
  // RWRW Gruntfile needs to have correct object.props
  // this.template('Gruntfile.js', 'Gruntfile.js'); //template
};

Generator.prototype.packageJSON = function packageJSON() {
//   this.template('_package.json', 'package.json'); //template
};

Generator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

Generator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
//   this.copy('bower.json', 'bower.json'); //template
};

Generator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

Generator.prototype.editor = function editor() {
  this.copy('editorconfig', '.editorconfig');
};

Generator.prototype.jekFiles = function jekFiles() {
  // 2nd post //copy
  // readme //template

  // config.yml //template


  // remove pyg //del should this be in a pygments meth?

  // build gemfile/ bundler with markdown libs needed //template

  // RWRW jek pyg needs to be added in index.html
  if (this.jekPyg) {
    this.copy(path.join(this.defaultDirs.tmpJek, 'css/syntax.css'), path.join('app', this.cssDir, 'syntax.css'));
  }

};

Generator.prototype.cssPreSass = function cssPreSass() {
  if (['s', 'c'].indexOf(this.cssPre)) {

      // mkdir
      // callback
        // if h5
        // mv h5css to scss

        // else
        // mv dflt css to scss

        // if pyg
        // move pyg to scss
  }
};

Generator.prototype.jsPreCoffee = function jsPreCoffee() {
  if (this.jsPre === 'c') {

  // mkdir
    // callback make file

  }
};



// TODO: These ↓

// Generator.prototype.requireJs = function testing() {
// };

// Generator.prototype.testing = function testing() {
//   this.copy('editorconfig', '.editorconfig');
// };

// TODO: Categories subgenerator
// TODO: Post subgenerator, copies default post for that cat frontmatter



/////////////////
// RWRW NOTES

// End with a list of commands and description
// all components managed with Bower
