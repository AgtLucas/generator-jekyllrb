// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>. Yo Jekyll!
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};
var yeomanConfig = {
  app: 'app',
  dist: 'dist',
  css: '<%= cssDir %>',<% if (cssPre) { %>
  cssPre: '<%= cssPreDir %>',<% } %>
  js: '<%= jsDir %>',<% if (jsPre) { %>
  jsPre: '<%= jsPreDir %>',<% } %>
  img: '<%= imgDir %>',
  fonts: '<%= fontsDir %>'
};

module.exports = function (grunt) {

  // Configuration
  grunt.initConfig({
    yeoman: yeomanConfig,

    watch: {<% if (cssPre === 'sass') { %>
      sass: {
        files: ['<%%= yeoman.app %>/<%%= yeoman.cssPre %>/**/*.{scss,sass}'],
        tasks: ['sass:server']
      },<% } %><% if (cssPre === 'compass') { %>
      compass: {
        files: ['<%%= yeoman.app %>/<%%= yeoman.cssPre %>/**/*.{scss,sass}'],
        tasks: ['compass:server']
      },<% } %><% if (autoPre) { %>
      stageCss: {
        files: ['<%%= yeoman.app %>/<%%= yeoman.css %>/**/*.css'],
        tasks: ['copy:stageCss']
      },
      autoprefixer: {
        files: ['.tmp/<%%= yeoman.css %>/**/*.css'],
        tasks: ['autoprefixer:server']
      },<% } %><% if (jsPre === 'coffeescript') { %>
      coffee: {
        files: ['<%%= yeoman.app %>/<%%= yeoman.jsPre %>/**/*.coffee'],
        tasks: ['coffee:server']
      },
      coffeeTest: {
        files: ['test/spec/**/*.coffee'],
        tasks: ['coffee:test']
      },<% } %>
      jekyll: {
        files: ['<%%= yeoman.app %>/**/*.{html,yml,md,mkd,markdown}',
                '!<%%= yeoman.app %>/bower_components'],
        tasks: ['jekyll:server']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '.jekyll/**/*.html',<% if (autoPre) { %>
          '.tmp/<%%= yeoman.css %>/**/*.css',<% } else { %>
          '{.tmp,<%%= yeoman.app %>}/<%%= yeoman.css %>/**/*.css',<% } %>
          '{.tmp,<%%= yeoman.app %>}/<%%= js %>/**/*.js',
          '<%%= yeoman.app %>/<%%= yeoman.img %>/**/*.{gif,jpg,jpeg,png,svg,webp}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change hostname to null to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
            lrSnippet,
            mountFolder(connect, '.tmp'),
            mountFolder(connect, '.jekyll'),
            mountFolder(connect, yeomanConfig.app)];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
            mountFolder(connect, '.tmp'),
            mountFolder(connect, 'test')];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
            mountFolder(connect, yeomanConfig.dist)];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>'
      }
    },
    // Running Jekyll also cleans all non-git files from its destination unless
    // they are specifically declared in _config.yml's `keep_files`
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= yeoman.dist %>/*',
            '!<%%= yeoman.dist %>/.git*']
        }]
      },
      server: ['.tmp', '.jekyll']
    },<% if (cssPre === 'sass') { %>
    // Add the sass files you want to compile in this task.
    // TODO: Revise to watch default directories when
    // https://github.com/gruntjs/grunt-contrib-sass/issues/40 is resolved.
    sass: {
      options: {
        bundleExec: true,
        style: 'expanded',
        debugInfo: true,
        lineNumbers: true,
        loadPath: 'app/bower_components'
      },
      dist: {
        options: {
          debugInfo: false,
          lineNumbers: false
        },
        files: {
          '.tmp/<%%= yeoman.css %>/main.css': '<%%= yeoman.app %>/<%%= yeoman.cssPre %>/main.scss',
          '.tmp/<%%= yeoman.css %>/syntax.css': '<%%= yeoman.app %>/<%%= yeoman.cssPre %>/syntax.scss'
        }
      },
      server: {
        files: {
          '.tmp/<%%= yeoman.css %>/main.css': '<%%= yeoman.app %>/<%%= yeoman.cssPre %>/main.scss',
          '.tmp/<%%= yeoman.css %>/syntax.css': '<%%= yeoman.app %>/<%%= yeoman.cssPre %>/syntax.scss'
        }
      }
    },<% } %><% if (cssPre === 'compass') { %>
    compass: {
      options: {
        // require: ['singularity', 'jacket'],
        bundleExec: true,
        sassDir: '<%%= yeoman.app %>/<%%= yeoman.cssPre %>',
        cssDir: '.tmp/<%%= yeoman.css %>',
        imagesDir: '<%%= yeoman.app %>/<%%= yeoman.img %>',
        fontsDir: '<%%= yeoman.app %>/<%%= yeoman.fonts %>',
        javascriptsDir: '<%%= yeoman.app %>/<%%= yeoman.js %>',
        relativeAssets: false,
        httpImagesPath: '/<%%= yeoman.img %>',
        httpGeneratedImagesPath: '/<%%= yeoman.img %>/generated',
        outputStyle: 'expanded',
        raw: 'asset_cache_buster :none \nextensions_dir = "<%%= yeoman.app %>/bower_components"\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%%= yeoman.dist %>/<%%= yeoman.img %>/generated'
        }
      },
      server: {
        options: {
          debugInfo: true,
          generatedImagesDir: '.tmp/<%%= yeoman.img %>/generated'
        }
      }
    },<% } %><% if (autoPre) { %>
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/<%%= yeoman.css %>',
          src: '**/*.css',
          dest: '.tmp/<%%= yeoman.css %>'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '.tmp/<%%= yeoman.css %>',
          src: ['**/*.css'],
          dest: '.tmp/<%%= yeoman.css %>'
        }]
      }
    },<% } %><% if (jsPre === 'coffeescript') { %>
    coffee: {
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '**/*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/<%%= yeoman.jsPre %>',
          src: '**/*.coffee',
          dest: '.tmp/<%%= yeoman.js %>',
          ext: '.js'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/<%%= yeoman.jsPre %>',
          src: '**/*.coffee',
          dest: '.tmp/<%%= yeoman.js %>',
          ext: '.js'
        }]
      }
    },<% } %>
    jekyll: {
      // TODO: switch config to options style after
      // https://github.com/dannygarcia/grunt-jekyll/pull/14
      dist: {
        bundleExec: true,
        src : '<%%= yeoman.app %>',
        dest: '<%%= yeoman.dist %>',
        server : false,
        auto : false,
        config: '_config.yml,_config.build.yml'
      },
      server: {
        bundleExec: true,
        src : '<%%= yeoman.app %>',
        dest: '.jekyll',
        server : false,
        auto : false,
        config: '_config.yml'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '{.tmp,<%%= yeoman.app %>}/<%%= yeoman.js %>/**/*.js',
        '!<%%= yeoman.app %>/<%%= yeoman.js %>/vendor/**/*',
        'test/spec/**/*.js'
      ],
      report: [
        '{.tmp,<%%= yeoman.app %>}/<%%= yeoman.js %>/**/*.js',
        '!<%%= yeoman.app %>/<%%= yeoman.js %>/vendor/**/*'
      ]
    },
    // TODO: rewrite for globbing and bundleExec when 5.0 is released
    csscss: {
      options: {
        minMatch: 2,<% if (cssPre === 'compass' || cssPre === 'sass') { %>
        ignoreSassMixins: false,<% } %><% if (cssPre === 'compass') { %>
        compass: true,<% } %><% if (!cssPre) { %>
        showParserErrors: true,<% } %>
        colorize: true,
        shorthand: false,
        verbose: true
      },
      // Add files to be checked here
      report: {<% if (!cssPre) { %>
       src: ['<%%= yeoman.app %>/<%%= yeoman.css %>/main.css']<% } %><% if (cssPre === 'compass' || cssPre === 'sass') { %>
       src: ['<%%= yeoman.app %>/<%%= yeoman.cssPre %>/main.scss']<% } %>
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      report: {
        src: ['{.tmp,<%%= yeoman.app %>}/<%%= yeoman.css %>/**/*.css']
      }
    },
    // UseminPrepare will only scan one page for usemin blocks. If you have
    // usemin blocks that aren't used in index.html, create a usemin manifest
    // page (hackery!) and point this task there.
    useminPrepare: {
      options: {
        dest: '<%%= yeoman.dist %>'
      },
      html: '<%%= yeoman.dist %>/index.html'
    },
    usemin: {
      options: {
          basedir: '<%%= yeoman.dist %>',
          dirs: ['<%%= yeoman.dist %>/**/*']
      },
      html: ['<%%= yeoman.dist %>/**/*.html'],
      css: ['<%%= yeoman.dist %>/<%%= yeoman.css %>/**/*.css']
    },
    // Usemin runs concat, but this is left here if you need it
    /* concat: {
      dist: {}
    },*/
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%%= yeoman.dist %>',
          src: '**/*.html',
          dest: '<%%= yeoman.dist %>'
        }]
      }
    },
    cssmin: {
      dist: {
        options: {
          // banner: '/* See more of my projects at github.com/<%= github %> */',
          report: 'gzip'
        }
        // Usemin adds files to cssmin
        // files: {}
      }
    },
    uglify: {
      // Usemin adds files to uglify
      // files: {}
    },
    imagemin: {
      dist: {
        options: {
          progressive: true
        },
        files: [{
          expand: true,
          cwd: '<%%= yeoman.dist %>',
          src: ['<%%= yeoman.img %>/**/*.{jpg,jpeg,png}', '*.png'],
          dest: '<%%= yeoman.dist %>'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.dist %>',
          src: '<%%= yeoman.img %>/**/*.svg',
          dest: '<%%= yeoman.dist %>'
        }]
      }
    },
    // TODO: Create more elegant bower_components workflow
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          src: [
            // Jekyll moves all html and text files
            // Usemin moves css and js files with concat
            // If your site requires it, add other file type patterns here
            '*.{ico,png}',
            '<%%= yeoman.fonts %>/**/*',
            '<%%= yeoman.img %>/**/*',
            // Move Bower assets to dist
            'bower_components/**/*.{css,js,gif,jpg,jpeg,png,svg,webp,eot*,ttf,woff}',
            // Reduce cruft by excluding tests
            '!bower_components/**/test/**/*',
            '!{.,_}*'
            ],
          dest: '<%%= yeoman.dist %>'
        }]
      },
      // Copy bower_component assets in case we need them for concatination
      stageCss: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          src: ['{<%%= yeoman.css %>,bower_components}/**/*.css', '!bower_components/**/test/**/*'],
          dest: '.tmp/'
        }]
      },
      stageJs: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          src: ['{<%%= yeoman.js %>,bower_components}/**/*.js', '!bower_components/**/test/**/*'],
          dest: '.tmp/'
        }]
      }
    },
    rev: {
      options: {
        length: 4
      },
      dist: {
        files: {
          src: [
            '<%%= yeoman.dist %>/<%%= yeoman.js %>/**/*.js',
            '<%%= yeoman.dist %>/<%%= yeoman.css %>/**/*.css',
            '<%%= yeoman.dist %>/<%%= yeoman.img %>/**/*.{gif,jpg,jpeg,png,svg,webp}',
            '<%%= yeoman.dist %>/<%%= yeoman.fonts %>/**/*.{eot*,svg,ttf,woff}']
        }
      }
    },
    concurrent: {
      server: [<% if (cssPre === 'sass') { %>
        'sass:server',<% } %><% if (cssPre === 'compass') { %>
        'compass:server',<% } %><% if (jsPre === 'coffee') { %>
        'coffee:server',<% } %>
        'copy:stageCss',
        'jekyll:server'],
      dist: [<% if (cssPre === 'sass') { %>
        'sass:dist',<% } %><% if (cssPre === 'compass') { %>
        'compass:dist',<% } %><% if (jsPre === 'coffee') { %>
        'coffee:dist',<% } %>
        'copy:stageCss',
        'copy:stageJs',
        'copy:dist']
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Define Tasks
  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',<% if (autoPre) { %>
      'autoprefixer:server',<% } %>
      'connect:livereload',
      'open',
      'watch']);
  });

  // No real tests yet. Add your own.
  // grunt.registerTask('test', [
  //   'clean:server',
  //   'concurrent:test',
  //   'connect:test']);

  grunt.registerTask('report', [
    'clean:server',<% if (cssPre === 'sass') { %>
    'sass:server',<% } %><% if (cssPre === 'compass') { %>
    'compass:server',<% } %><% if (jsPre === 'coffee') { %>
    'coffee:server',<% } %>
    'jshint:report',
    'csscss:report',
    'csslint:report'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    // Jekyll cleans its destination before it compiles, so must run first
    'jekyll:dist',
    'concurrent:dist',<% if (autoPre) { %>
    'autoprefixer:dist',<% } %>
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'imagemin',
    'svgmin',
    'rev',
    'usemin',
    'htmlmin'
    ]);

  grunt.registerTask('default', [
    'report',
    'build']);
};
