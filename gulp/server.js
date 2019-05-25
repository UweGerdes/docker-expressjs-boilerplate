/**
 * Gulp server tasks
 *
 * @module gulp/server
 */

'use strict';

const gulp = require('gulp'),
  changedInPlace = require('gulp-changed-in-place'),
  server = require('gulp-develop-server'),
  livereload = require('gulp-livereload'),
  sequence = require('gulp-sequence'),
  config = require('../lib/config'),
  ipv4addresses = require('../lib/ipv4addresses.js'),
  loadTasks = require('./lib/load-tasks'),
  log = require('../lib/log'),
  notify = require('./lib/notify');


const tasks = {
  /**
   * Start all configured server tasks for current NODE_ENV setting
   *
   * @function server
   * @param {function} callback - gulp callback to signal end of task
   */
  'server': [['eslint'], (callback) => {
    sequence(
      ...config.gulp.start[process.env.NODE_ENV].server,
      callback
    );
  }],
  /**
   * Server start task
   *
   * @function server-start
   * @param {function} callback - gulp callback to signal end of task
   */
  'server-start': (callback) => {
    server.listen({
      path: config.server.server,
      env: { VERBOSE: true, FORCE_COLOR: 1 }
    },
    callback);
  },
  /**
   * Server changed task restarts server
   *
   * @function server-changed
   * @param {function} callback - gulp callback to signal end of task
   */
  'server-changed': (callback) => {
    server.changed((error) => {
      if (!error) {
        livereload.changed({ path: '/', quiet: false });
      }
      callback();
    });
  },
  /**
   * Server livereload task notifies clients
   *
   * @function livereload
   */
  'livereload': () => {
    return gulp.src(config.gulp.watch.livereload)
      .pipe(changedInPlace({ howToDetermineDifference: 'modification-time' }))
      .pipe(notify({ message: '<%= file.path %>', title: 'livereload' }))
      .pipe(livereload({ quiet: true }));
  },
  /**
   * Trigger of livereload task with first file configured for livereload
   *
   * @function livereload-index
   */
  'livereload-index': () => {
    return gulp.src(config.gulp.watch.livereload[0])
      .pipe(notify({ message: 'triggered', title: 'livereload' }))
      .pipe(livereload({ quiet: true }));
  },
  /**
   * Livereload server start task
   *
   * @function livereload-start
   */
  'livereload-start': () => {
    livereload.listen({
      port: process.env.LIVERELOAD_PORT,
      delay: 2000,
      quiet: false
    });
    log.info('livereload listening on http://' +
      ipv4addresses.get()[0] + ':' + process.env.LIVERELOAD_PORT);
  }
};

loadTasks.importTasks(tasks);
