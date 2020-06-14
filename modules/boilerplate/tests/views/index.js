/**
 * Test for boilerplate page elements
 */

'use strict';

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  assert = chai.assert,
  expect = chai.expect,
  { JSDOM } = jsdom;

chai.use(chaiHttp);

describe('/boilerplate/tests/views/index.js', function () {
  describe('GET /boilerplate/', function () {
    it('should have head and script', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          assert.equal(document.title, 'Boilerplate');
          assert.equal(document.head.getElementsByTagName('script').length, 1);
          assert.equal(
            document.head.getElementsByTagName('script')[0].attributes.src.nodeValue,
            '/boilerplate/script.js'
          );
          done();
        });
    });
    it('should have headline', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'Boilerplate');
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
    it('should have subheadline de', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/')
        .set('Accept-Language', 'de;q=0.8,en;q=0.3')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const headline = document.querySelector('.boilerplate-headline');
          assert.equal(headline.textContent, 'Hier ist die Boilerplate');
          done();
        });
    });
    it('should have subheadline en', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/')
        .set('Accept-Language', 'en;q=0.9,de;q=0.5')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const headline = document.querySelector('.boilerplate-headline');
          assert.equal(headline.textContent, 'Welcome to Boilerplate');
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
