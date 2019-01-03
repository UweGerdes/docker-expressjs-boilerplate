/**
 * ## Controller for login
 *
 * @module login/controller
 */

'use strict';

const axios = require('axios'),
  fs = require('fs'),
  yaml = require('js-yaml'),
  path = require('path'),
  config = require('../../../lib/config'),
  model = require('./model.js');

const viewBase = path.join(path.dirname(__dirname), 'views');

const moduleConfig = yaml.safeLoad(
  fs.readFileSync(path.join(__dirname, '..', 'configuration.yaml'), 'utf8')
);

const viewRenderParams = {
  // model data
  // view helper functions
};

/**
 * ### index page
 *
 * render the index page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const index = (req, res) => {
  let data = Object.assign({
    title: 'Login'
  },
  req.params,
  getHostData(req),
  viewRenderParams,
  model.getData());
  if (req.session.userdata) {
    data.userdata = req.session.userdata;
  }
  res.render(path.join(viewBase, 'index.pug'), data);
};

/**
 * ### callback page
 *
 * render the callback page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const callback = async (req, res) => {
  const requestToken = req.query.code;
  if (requestToken) {
    const oauth = moduleConfig.oauth2.GitHub;
    req.session.oauthProvider = 'GitHub';
    const response = await axios({
      method: 'post',
      url: `${oauth.accessTokenUri}?${oauth.clientIDParamName}=${oauth.clientID}&${oauth.clientSecretParamName}=${oauth.clientSecret}&code=${requestToken}`,
      headers: {
        accept: 'application/json'
      }
    });
    const accessToken = response.data.access_token;
    req.session.accessToken = accessToken;
    const userdata = await axios({
      method: 'get',
      url: `${oauth.userdataUri}`,
      headers: {
        Authorization: 'token ' + accessToken
      }
    });
    req.session.userdata = userdata.data;
    res.redirect('/login/');
  } else {
    req.session.unauthorized = true;
    let data = Object.assign({
      title: 'unauthorized'
    },
    req.params,
    getHostData(req),
    viewRenderParams,
    model.getData());
    res.status(401).render(path.join(viewBase, 'unauthorized.pug'), data);
  }
};

module.exports = {
  index: index,
  callback: callback
};

/**
 * Get the host data for livereload
 *
 * @private
 * @param {String} req - request
 */
function getHostData(req) {
  let livereloadPort = config.server.livereloadPort || process.env.LIVERELOAD_PORT;
  const host = req.get('Host');
  if (host.indexOf(':') > 0) {
    livereloadPort = parseInt(host.split(':')[1], 10) + 1;
  }
  return {
    environment: process.env.NODE_ENV,
    hostname: req.hostname,
    livereloadPort: livereloadPort,
    module: moduleConfig
  };
}
