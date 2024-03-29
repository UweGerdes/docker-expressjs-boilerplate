/**
 * Log output helper
 *
 * @module lib/log
 */

'use strict';

const chalk = require('chalk'),
  dateFormat = require('dateformat');

module.exports = {
  /**
   * Print timestamp and message to console
   *
   * @function info
   * @param {String} msg - output message
   */
  info: (...msg) => {
    console.log('[' + chalk.gray(dateFormat(new Date(), 'HH:MM:ss')) + '] ' + msg.join(' '));
  }
};
