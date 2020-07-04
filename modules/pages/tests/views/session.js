/**
 * Test for session handling
 *
 * @module modules/pages/tests/views/session
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

const agent = request.agent(app),
  agent1 = request.agent(app);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let http,
  err = null,
  document;

describe('/pages/tests/views/session.js', () => {
  describe('GET /app/', () => {
    it('should have head, headline and links', async () => {
      try {
        http = await agent.get('/app/');
      /* c8 ignore next 3 */
      } catch (error) {
        err = error;
      }
      document = checkResponse(http, err);
      checkPage(document, 'Module', 'Home');
      testElement('#headline', { }, 'Module:');
      // console.log(JSON.stringify(http.header['set-cookie']));
    });
    it('should have session', async () => {
      try {
        http = await agent1.get('/app/')
          .set('Cookie', 'nameOne=valueOne;nameTwo=valueTwo');
      /* c8 ignore next 3 */
      } catch (error) {
        err = error;
      }
      document = checkResponse(http, err);
      checkPage(document, 'Module', 'Home');
      testElement('#headline', { }, 'Module:');
      // console.log(JSON.stringify(http.headers['set-cookie']));
    });
    it('should persist session', async () => {
      try {
        http = await agent1.get('/app/');
      /* c8 ignore next 3 */
      } catch (error) {
        err = error;
      }
      document = checkResponse(http, err);
      checkPage(document, 'Module', 'Home');
      testElement('#headline', { }, 'Module:');
      // console.log(JSON.stringify(http.headers));
      // console.log(Object.keys(http.headers));
    });
  });
});

/**
 * check the response and error
 *
 * @param {Object} http - http result object
 * @param {Object} err - error object
 * @returns {Object} - document
 */
function checkResponse (http, err) {
  expect(err).to.be.null;
  expect(http).to.have.status(200);
  expect(http).to.be.html;
  return (new JSDOM(http.text)).window.document;
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
    assert.equal(breadcrumbs[breadcrumbs.length - 1].textContent.trim(), breadcrumb);
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
