module.exports = function(grunt) {

  // Load modules
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-watchify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Configs
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %>\n * (c) <%= pkg.author %> - <%= pkg.homepage %>\n * License: MIT (http://www.opensource.org/licenses/mit-license.php)\n*/\n'
      },
      build: {
        src: 'build/GSVPano.js',
        dest: 'build/GSVPano.min.js'
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
          'build/GSVPano.js': 'src/GSVPano.js'
        },
        options: {}
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
        src: './src/GSVPano.js',
        dest: 'build/GSVPano.js'
      }
    },

    copy: {
      buildversion: {
        files: [{
          src: 'build/GSVPano.js',
          dest: 'build/GSVPano-<%= pkg.version %>.js'
        }, {
          src: 'build/GSVPano.min.js',
          dest: 'build/GSVPano-<%= pkg.version %>.min.js'
        }, ]
      },
    },

    clean: {
      build: ["build", "docs"]
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
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
    }


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

  grunt.registerTask('watch', ['watchify:dev']);

};