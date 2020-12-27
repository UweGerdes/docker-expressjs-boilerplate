/**
 * Gulp test tasks
 *
 * @module gulp/tests
 * @requires module:lib/config
 * @requires module:lib/files-promises
 * @requires module:gulp/lib/load-tasks
 * @requires module:gulp/lib/notify
 */

'use strict';

const gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  gulpStreamToPromise = require('gulp-stream-to-promise'),
  config = require('../lib/config'),
  files = require('../lib/files-promises'),
  notify = require('./lib/notify'),
  lint = require('./lint');

const tasks = {
  /**
   * Start all tests configured in `config.gulp.test.modules`
   *
   * @function test-modules
   * @param {function} callback - gulp callback to signal end of task
   */
  'test-modules': (callback) => {
    Promise.all(config.gulp.tests.modules.map(files.getFilenames))
      .then((filenames) => [].concat(...filenames))
      .then(files.getRecentFiles)
      .then((filenames) => {
        const task = gulp.src(filenames, { read: false })
          // `gulp-mocha` needs filepaths so you can't have any plugins before it
          .pipe(mocha({ reporter: 'tap', timeout: 10000 })) // timeout for Raspberry Pi 3
          /* c8 ignore next 3 */
          .on('error', function (error) {
            task.emit(error);
          })
          .pipe(notify({ message: 'tested: <%= file.path %>', title: 'Gulp test' }));
        return gulpStreamToPromise(task);
      })
      .then(() => {
        callback();
      })
      .catch(err => console.log(err));
  }
};

module.exports = tasks;

/**
 * Start all tests configured for current `NODE_ENV` setting
 *
 * @function test
 * @param {function} callback - gulp callback to signal end of task
 */
module.exports.tests = gulp.series(...Object.values(tasks));
