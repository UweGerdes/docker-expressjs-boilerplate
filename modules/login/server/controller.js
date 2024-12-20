/**
 * Controller for login
 *
 * @module modules/login/server/controller
 * @requires modules/login/server/model
 * @requires module:lib/config
 */

'use strict';

const axios = require('axios'),
  crypto = require('node:crypto'),
  path = require('path'),
  config = require('../../../lib/config'),
  model = require('./model.js');

const viewBase = path.join(path.dirname(__dirname), 'views');

let oauth2StateString = crypto.randomBytes(20).toString('hex');
/**
 * Render the index page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const index = (req, res) => {
  oauth2StateString = crypto.randomBytes(20).toString('hex');
  req.session.oauth2StateString = oauth2StateString;
  let data = {
    ...config.getData(req),
    ...req.params,
    ...model.getData()
  };
  if (req.session && req.session.userdata) {
    data.userdata = req.session.userdata;
  }
  res.render(path.join(viewBase, 'index.pug'), data);
};

/**
 * Render callback page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const callback = async (req, res) => {
  const requestToken = req.query.code;
  const requestState = req.query.state;
  if (requestToken && requestState === oauth2StateString) {
    const oauth = config.modules.login.oauth2.GitHub;
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
    let data = {
      ...config.getData(req),
      ...req.params,
      ...model.getData()
    };
    res.status(401).render(path.join(viewBase, 'unauthorized.pug'), data);
  }
};

/**
 * Logout and redirect to login page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const logout = (req, res) => {
  delete req.session.oauthProvider;
  delete req.session.accessToken;
  delete req.session.userdata;
  res.redirect('/login/');
};

/**
 * async loaded login page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const include = (req, res) => {
  let data = {
    ...config.getData(req),
    ...req.params,
    ...model.getData()
  };
  if (req.session && req.session.userdata) {
    data.userdata = req.session.userdata;
  }
  res.render(path.join(viewBase, 'include', req.params.template + '.pug'), data);
};

module.exports = {
  index: index,
  callback: callback,
  logout: logout,
  include: include
};
