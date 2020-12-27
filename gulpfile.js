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

const { series, watch } = require('gulp'),
  { gulp } = require('./lib/config'),
  log = require('./lib/log');

const tasks = {
  ...require('./gulp/build'),
  ...require('./gulp/lint'),
  ...require('./gulp/server'),
  ...require('./gulp/tests'),
  ...require('./gulp/watch')
};
/* c8 ignore next 3 */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

module.exports = tasks;

const myTasks = gulp.start[process.env.NODE_ENV].default
  .reduce((obj, key) => {
    return {
      ...obj,
      [key]: tasks[key]
    };
  }, {});

module.exports.default = series(...Object.values(myTasks));
