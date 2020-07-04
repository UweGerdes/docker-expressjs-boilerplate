/**
 * Test for boilerplate modal layer
 *
 * @module modules/page-elements/tests/views/modallayer
 */

'use strict';

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  assert = chai.assert,
  expect = chai.expect,
  app = 'https://localhost:8443';

chai.use(chaiHttp);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let document;

describe('/page-elements/tests/views/modallayer.js', function () {
  describe('GET /boilerplate/', function () {
    it('should have head, script and headline', function (done) {
      chai.request(app)
        .get('/boilerplate/')
        .end(function (err, res) {
          document = getDocument(res, err);
          checkPage(document, 'Boilerplate', 'Benutzeranmeldenregistrieren');
          testElement('#login-status', { }, 'Benutzeranmeldenregistrieren');
          testElement('#modalLayer', { }, '');
          done();
        });
    });
  });
});

/**
 * Check the response and error and return document
 *
 * @param {Object} res - result object
 * @param {Object} err - error object
 * @returns {Object} - document
 */
function getDocument (res, err) {
  expect(err).to.be.null;
  expect(res).to.have.status(200);
  expect(res).to.be.html;
  return (new jsdom.JSDOM(res.text)).window.document;
}

/**
 * Test several elements and error message in document
 *
 * @param {Object} document - document tree
 * @param {String} title - page title
 * @param {String} breadcrumb - text for third breadcrumb
 * @param {String} loginStatusLabel - text to show in .login-status
 */
function checkPage (document, title, loginStatusLabel) {
  assert.equal(document.title, title);
  const loginStatus = document.querySelectorAll('.login-status');
  assert.equal(loginStatus.length, 1);
  assert.equal(loginStatus[0].textContent, loginStatusLabel);
}

/**
 * Test DOM element properties
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
