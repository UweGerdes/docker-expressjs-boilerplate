/**
 * Routes for boilerplate
 *
 * @module modules/boilerplate/server/index
 * @requires module:modules/boilerplate/server/controller
 */

'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap

const controller = require('./controller');

/**
 * GET / route
 *
 * @name get_default_route
 */
router.get('/', controller.index);

/**
 * GET /form route
 *
 * @name get_form_route
 */
router.get('/form', controller.form);

/**
 * POST /form route
 *
 * @name post_form_route
 */
router.post('/form', controller.form);

module.exports = {
  router: router
};
