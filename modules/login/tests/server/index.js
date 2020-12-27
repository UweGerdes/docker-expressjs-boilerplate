/**
 * Test for login page elements
 *
 * @module modules/login/tests/server/index
 */

'use strict';

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  assert = chai.assert,
  expect = chai.expect,
  { JSDOM } = jsdom;

chai.use(chaiHttp);

describe('/login/tests/server/index.js', function () {
  describe('GET /login/', function () {
    it('should have head', function (done) {
      chai.request('http://localhost:8080')
        .get('/login/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          assert.equal(document.title, 'Login');
          done();
        });
    });
    it('login should have headline and links', function (done) {
      chai.request('http://localhost:8080')
        .get('/login/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'Login');
          const links = document.querySelectorAll('#login-list li a');
          assert.equal(links.length, 1);
          done();
        });
    });
    it('logout should have headline and links', function (done) {
      chai.request('http://localhost:8080')
        .get('/login/logout/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'Login');
          const links = document.querySelectorAll('#login-list li a');
          assert.equal(links.length, 1);
          done();
        });
    });
  });
});
