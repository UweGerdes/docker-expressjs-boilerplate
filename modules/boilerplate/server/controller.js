/**
 * Controller for boilerplate
 *
 * @module modules/boilerplate/server/controller
 * @requires modules/boilerplate/server/model
 * @requires module:lib/config
 */

'use strict';

const path = require('path'),
  config = require('../../../lib/config'),
  model = require('./model');

const viewBase = path.join(path.dirname(__dirname), 'views');

/**
 * render index page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const index = (req, res) => {
  let data = config.getData(req);
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
  let data = Object.assign({ },
    config.getData(req),
    {
      data: false,
      model: model.getData(),
      post: { }
    });
  let statusCode = 200;
  if (req.method === 'POST' && req.body) {
    data.post = req.body;
    // delete data.post.password;
  }
  res.status(statusCode).render(path.join(viewBase, 'form.pug'), data);
};

module.exports = {
  index: index,
  form: form
};
