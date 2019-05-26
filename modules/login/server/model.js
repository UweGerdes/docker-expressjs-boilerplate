/**
 * Model for login
 *
 * @module modules/login/server/model
 */

'use strict';

let data = { modelData: 'login data' };

module.exports = {
  /**
   * Get data
   *
   * @returns {object} model data
   */
  getData: () => {
    return data;
  }
};
