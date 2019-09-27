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
 * Render index page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const index = (req, res) => {
  let data = config.getData(req);
  res.render(path.join(viewBase, 'index.pug'), data);
};

/**
 * Render form page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const form = (req, res) => {
  let data = {
    ...config.getData(req),
    data: false,
    model: model.getData(),
    values: { }
  };
  let statusCode = 200;
  if (req.method === 'POST' && req.body) {
    data.values = req.body;
    // delete data.values.password;
  }
  res.status(statusCode).render(path.join(viewBase, 'form.pug'), data);
};

module.exports = {
  index: index,
  form: form
};
