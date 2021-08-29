/**
 * Gulp server task for boilerplate - no real function, just test
 *
 */

'use strict';

const tasks = {
  /**
   * test task
   *
   * @function boilerplate-server
   * @param {function} callback - gulp callback to signal end of task
   */
  /* c8 ignore next 4 */
  'boilerplate-server': (callback) => {
    console.log('boilerplate-server called');
    callback();
  }
};

module.exports = tasks;
