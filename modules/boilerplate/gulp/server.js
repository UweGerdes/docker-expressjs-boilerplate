/**
 * Gulp server task for boilerplate - no real function, just test
 *
 */

'use strict';

delete require.cache[require.resolve('gulp-develop-server')];

const gulp = require('gulp'),
  server = require('gulp-develop-server'),
  livereload = require('gulp-livereload'),
  path = require('path'),
  config = require('../../../lib/config'),
  log = require('../../../lib/log'),
  lint = require('../../../gulp/lint');

const tasks = {
  /**
   * boilerplate sample server start task
   *
   * @function boilerplate-server-start
   * @param {function} callback - gulp callback to signal end of task
   */
  /* c8 ignore next 4 */
  'boilerplate-server-start': (callback) => {
    log.info('boilerplate-server-start called ' + Object.keys(config));
    log.info(path.join(__dirname, config.modules.boilerplate.app.server));
    server.listen(
      {
        path: path.join(__dirname, config.modules.boilerplate.app.server),
        env: { VERBOSE: true, FORCE_COLOR: 1 },
        delay: 9000
      },
      callback
    );
  },
  /**
   * boilerplate sample server changed (restart) task
   *
   * @function boilerplate-server-changed
   * @param {function} callback - gulp callback to signal end of task
   */
  /* c8 ignore next 4 */
  'boilerplate-server-changed': gulp.series(
    lint.eslint,
    function serverChanged(callback) {
      log.info('boilerplate-server-changed called ' + Object.keys(config));
      server.changed((error) => {
        if (!error) {
          livereload.changed({ path: '/', quiet: false });
        }
        callback();
      });
    }
  )
};

module.exports = tasks;
