/**
 * Gulp test tasks
 *
 * @module gulp/tests
 * @requires module:lib/config
 * @requires module:lib/files-promises
 * @requires module:gulp/lib/load-tasks
 * @requires module:gulp/lib/notify
 * @requires module:gulp/lint
 */

'use strict';

const gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  glob = require('glob'),
  config = require('../lib/config'),
  notify = require('./lib/notify'),
  lint = require('./lint');

let tasks = {
  /**
   * Start all tests configured in `config.gulp.test.modules`
   *
   * @function test-modules
   * @param {function} callback - gulp callback to signal end of task
   */
  'test-modules': gulp.series(lint.eslint, function testModules() {
    const task = gulp.src(config.gulp.tests.modules, { read: false })
      // `gulp-mocha` needs filepaths so you can't have any plugins before it
      .pipe(mocha({ reporter: 'tap', timeout: 10000 })) // timeout for Raspberry Pi 3
      /* c8 ignore next 3 */
      .on('error', function (error) {
        task.emit(error);
      })
      .pipe(notify({ message: 'tested: <%= file.path %>', title: 'Gulp test' }));
    return task;
  })
};

let moduleTasks = [];
/**
 * Load gulp tests from modules
 *
 * @name module_gulp_loader
 */
glob.sync(config.server.modules + '/*/gulp/tests.js')
  .forEach((filename) => {
    let task = require('.' + filename);
    moduleTasks.push(task);
    tasks = Object.assign({}, tasks, task);
  });

module.exports = Object.assign({}, tasks, ...moduleTasks);
