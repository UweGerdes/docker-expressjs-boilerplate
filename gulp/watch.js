/**
 * ## Gulp watch task
 *
 * @module gulp/watch
 * @requires module:lib/config
 * @requires module:lib/log
 * @requires module:gulp/lib/load-tasks
 */

'use strict';

const gulp = require('gulp'),
  config = require('../lib/config'),
  log = require('../lib/log'),
  loadTasks = require('./lib/load-tasks');

const tasks = {
  /**
   * Watch and execute tasks when files changed for all tasks configured for current `NODE_ENV` setting
   *
   * @function watch
   */
  /* c8 ignore next 19 */
  'watch': (callback) => {
    global.gulpStatus.isWatching = true;

    const watchTasks = gulp.start[process.env.NODE_ENV].watch
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: tasks[key]
        };
      }, {});

    for (let task in watchTasks) {
      if (gulp.watch.hasOwnProperty(task)) {
        log.info('Task "' + task + '" is watching: ' + gulp.watch[task].join(', '));
        watch(gulp.watch[task], { events: 'all', ignoreInitial: true }, tasks[task]);
      }
    }
    callback();
  }
};

module.exports = tasks;
