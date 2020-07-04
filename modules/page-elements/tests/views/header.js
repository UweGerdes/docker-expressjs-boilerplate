/**
 * Test for boilerplate header elements
 *
 * @module modules/page-elements/tests/views/header
 */

'use strict';

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  assert = chai.assert,
  expect = chai.expect,
  { JSDOM } = jsdom;

chai.use(chaiHttp);

describe('/page-elements/tests/views/index.js', function () {
  describe('GET /boilerplate/', function () {
    it('should have headline', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const loginStatus = document.getElementById('login-status');
          assert.equal(loginStatus.textContent, 'Benutzeranmeldenregistrieren');
          done();
        });
    });
    it('should have breadcrumb', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const breadcrumbs = document.querySelectorAll('.header-breadcrumb-link');
          assert.equal(breadcrumbs[0].getAttribute('href'), '/app/', 'breadcrumb 1 href');
          assert.equal(breadcrumbs[0].textContent, 'Home');
          assert.equal(breadcrumbs[1].getAttribute('href'), '/boilerplate/', 'breadcrumb 2 href');
          assert.equal(breadcrumbs[1].textContent, 'Boilerplate');
          done();
        });
    });
  });
});

function getDocument (res, err) {
  expect(err).to.be.null;
  expect(res).to.have.status(200);
  expect(res).to.be.html;
  return (new JSDOM(res.text)).window.document;
}
