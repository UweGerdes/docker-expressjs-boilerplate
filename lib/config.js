/**
 * @module lib:config
 * @private
 */

'use strict';

const fs = require('fs'),
  glob = require('glob'),
  yaml = require('js-yaml'),
  path = require('path');

/**
 * Parse main configuration file
 *
 * @private
 */
const config = yaml.safeLoad(
  fs.readFileSync(path.join(__dirname, '..', 'configuration.yaml'), 'utf8')
);

/**
 * Parse config for all modules
 *
 * @private
 */
let modules = { };
glob.sync(config.server.modules + '/*/configuration.yaml')
  .forEach((filename) => {
    const module = filename.replace(/^.+\/([^\/]+)\/configuration\.yaml/, '$1');
    modules[module] = yaml.safeLoad(
      fs.readFileSync(filename, 'utf8')
    );
  });

module.exports = {
  /**
   * Exports config
   */
  config: config,
  /**
   * Exports modules
   */
  modules: modules,
  /**
   * Exports gulp
   */
  gulp: config.gulp,
  /**
   * Exports server
   */
  server: config.server
};
