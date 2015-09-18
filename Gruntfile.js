module.exports = function(grunt) {

  // Load modules
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-watchify');

  // Configs
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*!\n * <%= pkg.pkgname %> v<%= pkg.version %>\n * (c) <%= pkg.homepage %>\n * License: <%= pkg.license %>\n*/\n'
      },
      build: {
        src: 'build/<%= pkg.pkgname %>.js',
        dest: 'build/<%= pkg.pkgname %>.min.js'
      }
    },

    jshint: {
      options: {
        curly: false, //
        eqeqeq: false, //
        eqnull: true,
        browser: true,
        globals: {}
      },
      all: ['src/**/*.js']
    },

    browserify: {
      dist: {
        files: {
          'build/<%= pkg.pkgname %>.js': 'src/<%= pkg.pkgname %>.js'
        }
      }
    },

    watchify: {
      options: {
        // defaults options used in b.bundle(opts) 
        detectGlobals: true,
        insertGlobals: false,
        ignoreMissing: false,
        debug: true,
        standalone: false,
        keepalive: true
      },
      dev: {
        src: './src/<%= pkg.pkgname %>.js',
        dest: 'build/<%= pkg.pkgname %>.js'
      }
    },

    copy: {
      buildversion: {
        files: [{
          src: 'build/<%= pkg.pkgname %>.js',
          dest: 'build/<%= pkg.pkgname %>-<%= pkg.version %>.js'
        }, {
          src: 'build/<%= pkg.pkgname %>.min.js',
          dest: 'build/<%= pkg.pkgname %>-<%= pkg.version %>.min.js'
        }, ]
      },

      ghpages: {
        files: [{
          expand: true,
          src: 'build/**/*',
          dest: 'gh-pages/'
        }, {
          expand: true,
          src: 'docs/**/*',
          dest: 'gh-pages/'
        }, {
          expand: true,
          src: 'examples/**/*',
          dest: 'gh-pages/'
        }, {
          expand: true,
          cwd: 'page/',
          src: '**/*', // page/assets/*
          dest: 'gh-pages/'
        }]
      },
    },

    clean: {
      build: ['build', 'docs'],
      ghpages: ['gh-pages/docs', 'gh-pages/assets', 'gh-pages/examples']
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.pkgname %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'src/',
          outdir: 'docs/',
          themedir: 'node_modules/yuidoc-bootstrap-theme',
          helpers: ['node_modules/yuidoc-bootstrap-theme/helpers/helpers.js']
        }
      }
    },

  });

  // Register tasks

  grunt.registerTask('build', [
    'jshint:all',
    'clean:build',
    'browserify',
    'uglify',
    'yuidoc:compile',
    'copy:buildversion'
  ]);

  grunt.registerTask('gh-pages', [
    'clean:ghpages',
    'copy:ghpages'
  ]);

  grunt.registerTask('watch', ['watchify:dev']);

};