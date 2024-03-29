/**
 * Gulpfile for this project
 *
 * Gulp uses configuration variables stored in `./configuration.yaml`
 *
 * @module gulpfile
 * @requires module:gulp/build
 * @requires module:gulp/lint
 * @requires module:gulp/server
 * @requires module:gulp/tests
 * @requires module:gulp/watch
 * @requires module:lib/config
 * @requires module:lib/log
 */

'use strict';

global.gulpStatus = { isWatching: false };

const { series } = require('gulp'),
  config = require('./lib/config');

const tasks = {
  ...require('./gulp/build'),
  ...require('./gulp/lint'),
  ...require('./gulp/tests'),
  ...require('./gulp/server'),
  ...require('./gulp/watch')
};
/* c8 ignore next 3 */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

/**
 * Start all configured tasks for current `NODE_ENV` setting
 *
 * @function server
 * @param {function} callback - gulp callback to signal end of task
 */
Object.keys(config.gulp.start[process.env.NODE_ENV])
  .forEach((group) => {
    const configuredTasks = config.gulp.start[process.env.NODE_ENV][group]
      .filter(task => tasks.hasOwnProperty(task))
      .reduce((obj, task) => {
        return {
          ...obj,
          [task]: tasks[task]
        };
      }, {});
    tasks[group] = series(...Object.values(configuredTasks));
  });

module.exports = tasks;
