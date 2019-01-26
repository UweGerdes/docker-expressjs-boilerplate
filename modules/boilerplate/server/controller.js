/**
 * ## Controller for boilerplate
 *
 * @module boilerplate/controller
 */

'use strict';

const path = require('path'),
  config = require('../../../lib/config'),
  model = require('./model.js');

const viewBase = path.join(path.dirname(__dirname), 'views');

/**
 * ### index page
 *
 * render the index page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const index = (req, res) => {
  let data = getServerData(req);
  res.render(path.join(viewBase, 'index.pug'), data);
};

/**
 * ### form page
 *
 * render the form page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const form = (req, res) => {
  let data = getServerData(req);
  let statusCode = 200;
  if (req.method === 'POST' && req.body) {
    try {
      data.post = { username: req.body.username };
      // the following command should throw if user unknown
      data.user = { username: req.body.username };
      data.user.name = req.body.username;
      req.session.oauthProvider = config.modules.boilerplate.name;
      req.session.userdata = data.user;
    } catch (error) {
      data.error = error.message;
      statusCode = 302;
    }
  }
  res.status(statusCode).render(path.join(viewBase, 'form.pug'), data);
};

module.exports = {
  index: index,
  form: form
};

/**
 * Get the basic data for the response
 *
 * @private
 * @param {String} req - request
 */
function getServerData(req) {
  let livereloadPort = config.server.livereloadPort || process.env.LIVERELOAD_PORT;
  const host = req.get('Host');
  if (host.indexOf(':') > 0) {
    livereloadPort = parseInt(host.split(':')[1], 10) + 1;
  }
  return Object.assign({
    environment: process.env.NODE_ENV,
    hostname: req.hostname,
    livereloadPort: livereloadPort,
    module: config.modules.boilerplate,
    session: req.session,
    data: false,
    model: model.getData(),
    post: { }
  },
  req.params);
}
