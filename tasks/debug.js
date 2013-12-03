/*
 * grunt-debug-task
 * https://github.com/romario333/grunt-debug-task
 *
 * Copyright (c) 2013 Roman Masek
 * Licensed under the MIT license.
 */

'use strict';

var spawn = require('child_process').spawn;
var chrome = require('./lib/chrome');

module.exports = function(grunt) {

  grunt.registerTask('debug', 'Easily debug your Grunt tasks with node-inspector.', function() {
      var done = this.async();

      // remove any scheduled tasks as we will run them in another process
      grunt.task.clearQueue();

      // Merge task-specific options with these defaults
      var options = this.options({
          open: true
      });

      // take tasks after debug and run them in new process with --debug-brk
      var nodeBin = process.argv[0];
      var args = process.argv.slice(1).filter(function(arg) {return arg !== 'debug';});
      args = ['--debug-brk'].concat(args);
      grunt.log.writeln(nodeBin + ' ' + args.join(' '));
      var debugProcess = spawn(nodeBin, args);
      debugProcess.stdout.pipe(process.stdout);
      debugProcess.stderr.pipe(process.stderr);
      debugProcess.on('close', function() {
          if (nodeInspectorProcess) {
              nodeInspectorProcess.kill();
          }

          done();
      });

      // start node-inspector
      var nodeInspectorProcess = spawn('node_modules/.bin/node-inspector');
      nodeInspectorProcess.stdout.pipe(process.stdout);
      nodeInspectorProcess.stderr.pipe(process.stderr);

      // open node-inspector in Chrome (when ready)
      if (options.open) {
          var NODE_INSPECTOR_URL = 'http://127.0.0.1:8080/debug?port=5858';
          var nodeInspectorOut = '', isOpen = false;
          nodeInspectorProcess.stdout.on('data', function(chunk) {
              nodeInspectorOut += chunk;
              if (!isOpen && nodeInspectorOut.indexOf(NODE_INSPECTOR_URL) !== -1) {
                  grunt.log.writeln('Opening node-inspector in Chrome...');
                  chrome.open(NODE_INSPECTOR_URL);
                  isOpen = true;
              }
          });
      }
  });

};
