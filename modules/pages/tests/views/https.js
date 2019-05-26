/**
 * Test for sample-client
 */

'use strict';

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  request = require('supertest'),
  assert = chai.assert,
  expect = chai.expect,
  app = 'https://localhost:8443',
  { JSDOM } = jsdom;

chai.use(chaiHttp);

const agent = request.agent(app);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let res,
  err = null,
  document;

describe('/pages/tests/views/https.js', () => {
  describe('GET /app/', () => {
    it('should have head, headline and links', async () => {
      try {
        res = await agent.get('/app/');
      } catch (error) {
        err = error;
      }
      document = checkResponse(res, err);
      checkPage(document, 'Module', null);
      testError();
      testElement('#headline', { }, 'Module:');
    });
  });
});

/**
 * check the response and error
 *
 * @param {Object} res - result object
 * @param {Object} err - error object
 * @returns {Object} - document
 */
function checkResponse (res, err) {
  expect(err).to.be.null;
  expect(res).to.have.status(200);
  expect(res).to.be.html;
  return (new JSDOM(res.text)).window.document;
}

/**
 * test error message in document
 *
 * @param {Object} document - document tree
 * @param {String} title - page title
 * @param {String} breadcrumb - text for third breadcrumb
 */
function checkPage (document, title, breadcrumb) {
  assert.equal(document.title, title);
  const breadcrumbs = document.querySelectorAll('.header-breadcrumb');
  assert.isAtLeast(breadcrumbs.length, 1);
  assert.equal(breadcrumbs[0].textContent.trim(), 'Home');
  const breadcrumbLinks = document.querySelectorAll('.header-breadcrumb a');
  assert.isAtLeast(breadcrumbLinks.length, 1);
  if (breadcrumb) {
    assert.equal(breadcrumbs[breadcrumbs.length - 1].textContent, breadcrumb);
  }
}

/**
 * test DOM element properties
 *
 * @param {String} selector - to test
 * @param {Object} attr - element attributes to verify
 * @param {String} text - element.textContent
 */
function testElement(selector, attr, text) {
  const element = document.querySelectorAll(selector)[0];
  assert.exists(element, 'element ' + selector);
  for (const [name, value] of Object.entries(attr)) {
    assert.equal(element.getAttribute(name), value, 'element ' + selector + '.' + name);
  }
  if (text) {
    assert.equal(element.textContent, text, 'element ' + selector + ' text');
  }
}

/**
 * test error message in document
 *
 * @param {String} msg - error message or no error
 */
function testError(msg) {
  const errors = document.querySelectorAll('.error');
  if (msg) {
    assert.equal(errors.length, 1, 'errors');
    assert.equal(errors[0].textContent, msg, 'error');
  } else {
    assert.equal(errors.length, 0, errors.length > 0 ? 'error ' + errors[0].textContent : 'errors');
  }
}
