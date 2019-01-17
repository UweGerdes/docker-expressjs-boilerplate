/**
 * Test for boilerplate form elements
 */

'use strict';

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  assert = chai.assert,
  expect = chai.expect,
  { JSDOM } = jsdom;

chai.use(chaiHttp);

describe('/boilerplate/tests/views/form.js', function () {
  describe('GET /boilerplate/', function () {
    it('should have head, script and headline', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          assert.equal(document.title, 'Formular');
          assert.equal(document.head.getElementsByTagName('script').length, 1);
          assert.equal(
            document.head.getElementsByTagName('script')[0].attributes.src.nodeValue,
            '/js/boilerplate/script.js'
          );
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'Boilerplate');
          const subHeadline = document.querySelector('.subheadline');
          assert.equal(subHeadline.textContent, 'Formular');
          done();
        });
    });
    it('should have form and widgets', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const form = document.querySelector('form');
          assert.equal(form.getAttribute('method'), 'POST');
          assert.equal(form.getAttribute('action'), '/boilerplate/form/');
          const inputTextContainer = document.querySelector('.field_username');
          assert.equal(inputTextContainer.textContent, 'Username');
          const inputText = inputTextContainer.querySelector('.input-text');
          assert.equal(inputText.name, 'username');
          assert.equal(inputText.getAttribute('type'), 'text');
          const inputPasswordContainer = document.querySelector('.field_password');
          assert.equal(inputPasswordContainer.textContent, 'Passwort');
          const inputPassword = inputPasswordContainer.querySelector('.input-password');
          assert.equal(inputPassword.name, 'password');
          assert.equal(inputPassword.getAttribute('type'), 'password');
          const inputSubmitContainer = document.querySelector('.field_submit');
          const inputSubmit = inputSubmitContainer.querySelector('.input-submit');
          assert.equal(inputSubmit.getAttribute('type'), 'submit');
          assert.equal(inputSubmit.getAttribute('value'), 'anmelden');
          done();
        });
    });
  });
});
