/**
 * Gulp server task for boilerplate - no real function, just test
 *
 */

'use strict';

const config = require('../../../lib/config'),
  log = require('../../../lib/log');

const tasks = {
  /**
   * test task
   *
   * @function boilerplate-server
   * @param {function} callback - gulp callback to signal end of task
   */
  /* c8 ignore next 4 */
  'boilerplate-server': (callback) => {
    log.info('boilerplate-server called ' + Object.keys(config));
    // console.log(JSON.stringify(config, null, 4));
    callback();
  }
};

module.exports = tasks;
