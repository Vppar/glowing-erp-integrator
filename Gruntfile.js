
module.exports = function (grunt) {
  'use strict';
  
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },


    mochaTest: {
      test: {
        options: {
          reporter: 'dot',
          ui: 'bdd',
          ignoreLeaks: false
        },
        src: ['test/**/*.js']
      }
    }
  });


  // Load jshint task
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load mocha test task
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', ['jshint', 'mochaTest']);

  grunt.registerTask('default', ['test']);
};
