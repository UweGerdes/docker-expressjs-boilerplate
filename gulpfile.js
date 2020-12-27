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
 */

'use strict';

global.gulpStatus = { isWatching: false };

const { watch } = require('gulp'),
  { gulp } = require('./lib/config'),
  log = require('./lib/log');

const tasks = {
  ...require('./gulp/lint'),
  ...require('./gulp/build'),
  ...require('./gulp/server'),
  ...require('./gulp/tests')
};
/* c8 ignore next 3 */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

function gulpWatch(callback) {
  let tasklist = gulp.watch;
  if (gulp.start[process.env.NODE_ENV] && gulp.start[process.env.NODE_ENV].watch) {
    tasklist = gulp.start[process.env.NODE_ENV].watch
      .reduce((obj, key) => ({ ...obj, [key]: gulp.watch[key] }), {});
  }
  console.log('watch:', tasklist, process.env.NODE_ENV);
  global.gulpStatus.isWatching = true;
  for (let task in tasklist) {
    if (gulp.watch.hasOwnProperty(task)) {
      console.log('watch:', task);
      if (task === 'less') {
        log.info('Task "' + task + '" is watching: ' + tasklist[task]);
        console.log(tasklist[task], { events: 'all' /* ,  ignoreInitial: false */ }, tasks[task]);
        watch(tasklist[task], { events: 'all', ignoreInitial: false }, tasks[task]);
      }
    }
  }
  callback();
}

const myTasks = Object.keys(tasks)
  .filter(key => Object.keys(gulp.start[process.env.NODE_ENV]).includes(key))
  .reduce((obj, key) => {
    return {
      ...obj,
      [key]: tasks[key]
    };
  }, {});
console.log(process.env.NODE_ENV, Object.keys(myTasks));
module.exports = myTasks;
module.exports.watch = gulpWatch;

/*
require('./gulp/build');
require('./gulp/lint');
require('./gulp/server');
require('./gulp/tests');
require('./gulp/watch');

const gulp = require('gulp'),
  sequence = require('gulp-sequence'),
  config = require('./lib/config');
*/
/**
 * Gulp `default` task
 *
 * start tasks depending on `NODE_ENV`, some starts needed for changedInPlace dryrun
 *
 * @name module:gulpfile.default
 * @param {function} callback - gulp callback to signal end of task
 */
/* c8 ignore next 6 */
/*
gulp.task('default', (callback) => {
  sequence(
    ...config.gulp.start[process.env.NODE_ENV].gulp,
    callback
  );
});
*/
