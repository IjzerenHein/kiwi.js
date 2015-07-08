/*global module:false*/
/*eslint strict:false, quotes: [2, "single"] */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    tslint: {
      options: {
        configuration: '' //grunt.file.readJSON('tslint.json')
      },
      files: {
        src: ['src/*.ts']
      }
    },
    'string-replace': {
      dist: {
        files: {
          'tmp/kiwi-no-internal-modules.js': 'bin/kiwi.js'
        },
        options: {
          // Generating docs for compiled Typescript code isn't easy...
          // The following replacements were needed for jsdoc2md to do
          // its processing correctly.
          replacements: [{
            pattern: /\(function\s\(kiwi\)\s{/ig,
            replacement: ''
          }, {
            pattern: /}\)\(kiwi\s\|\|\s\(kiwi\s=\s{}\)\);/ig,
            replacement: ''
          }, {
            pattern: /\(function\s\(Operator\)\s{/ig,
            replacement: 'var Operator;'
          }, {
            pattern: /}\)\(kiwi.Operator\s\|\|\s\(kiwi.Operator\s\=\s{}\)\);/ig,
            replacement: ''
          }, {
            pattern: /\(function\s\(Strength\)\s{/ig,
            replacement: ''
          }, {
            pattern: /}\)\(Strength\s\=\skiwi.Strength\s\|\|\s\(kiwi.Strength\s\=\s{}\)\);/ig,
            replacement: ''
          }, {
            pattern: /function\screate\(a,\sb,\sc,\sw\)\s{/ig,
            replacement: 'Strength.create = function(a, b, c, w) {'
          }]
        }
      }
    },
    jsdoc2md: {
      output: {
        options: {
          'global-index-format': 'none',
          'module-index-format': 'none'
        },
        src: 'tmp/kiwi-no-internal-modules.js',
        dest: 'docs/Kiwi.md'
      }
    },
    exec: {
      build: 'tsc --noImplicitAny -m commonjs -d -out bin/kiwi.js src/kiwi.ts',
      test: 'mocha', // --compilers ts:typescript-require' // HR: can't get internal TS modules to work with typescript-require
      bench: 'node bench/main.js'
    },
    concat: {
      extras: {
        src: ['thirdparty/tsu.js', 'bin/kiwi.js'],
        dest: 'bin/kiwi.js',
      },
    },
    umd: {
      all: {
        options: {
          src: 'bin/kiwi.js',
          objectToExport: 'kiwi'
        }
      }
    },
    uglify: {
      dist: {
        src: './bin/kiwi.js',
        dest: './bin/kiwi.min.js'
      }
    },
    usebanner: {
      minified: {
        options: {
          position: 'top',
          banner:
            '/*-----------------------------------------------------------------------------\n' +
            '| Copyright (c) 2014, Nucleic Development Team.\n' +
            '|\n' +
            '| Distributed under the terms of the Modified BSD License.\n' +
            '|\n' +
            '| The full license is in the file COPYING.txt, distributed with this software.\n' +
            '-----------------------------------------------------------------------------*/'
        },
        files: {
          src: ['bin/kiwi.min.js']
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-umd');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-string-replace');

  // Tasks
  grunt.registerTask('lint', ['tslint']);
  grunt.registerTask('doc', ['string-replace', 'jsdoc2md']);
  grunt.registerTask('build', ['exec:build', 'doc', 'concat', 'umd']);
  grunt.registerTask('test', ['build', 'exec:test']);
  grunt.registerTask('bench', ['build', 'exec:bench']);
  grunt.registerTask('minify', ['uglify', 'usebanner']);
  grunt.registerTask('default', ['build', 'lint', 'minify', 'exec:test']);
};
