'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadNpmTasks('grunt-debug-task');
  
  grunt.registerTask('debug-me', function() {
    console.log('debug me');
  });
};
