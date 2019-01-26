/**
 * ## Controller for login
 *
 * @module login/controller
 */

'use strict';

const axios = require('axios'),
  path = require('path'),
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
  let data = Object.assign({ },
    config.getData(req),
    req.params,
    model.getData());
  if (req.session && req.session.userdata) {
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
    let data = Object.assign({ },
      config.getData(req),
      {
        title: 'unauthorized'
      },
      req.params,
      model.getData());
    res.status(401).render(path.join(viewBase, 'unauthorized.pug'), data);
  }
};

module.exports = {
  index: index,
  callback: callback
};
