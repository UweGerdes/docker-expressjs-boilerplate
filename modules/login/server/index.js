/**
 * Routes for login
 *
 * @module modules/login/server/index
 * @requires module:modules/login/server/controller
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
 * GET /callback route
 *
 * @name get_callback_route
 */
router.get('/callback', controller.callback);

/**
 * GET /logout route
 *
 * @name get_logout_route
 */
router.get('/logout', controller.logout);

/**
 * GET /include route
 *
 * @name get_include_route
 */
router.get('/include/:template', controller.include);

module.exports = {
  router: router,
  useExpress: controller.useExpress
};
