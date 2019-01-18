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

          const inputTextContainer = document.querySelector('.field_textinput');
          assert.equal(inputTextContainer.textContent, 'Texteingabe');
          const inputText = inputTextContainer.querySelector('.input-text');
          assert.equal(inputText.name, 'textinput');
          assert.equal(inputText.getAttribute('type'), 'text');

          const inputHidden = document.querySelector('[name=hiddeninput]');
          assert.equal(inputHidden.name, 'hiddeninput');
          assert.equal(inputHidden.value, 'wert');
          assert.equal(inputHidden.getAttribute('type'), 'hidden');

          const inputButtonContainer = document.querySelector('.field_buttoninput');
          assert.equal(inputButtonContainer.textContent, 'Button');
          const inputButton = inputButtonContainer.querySelector('.input-button');
          assert.equal(inputButton.name, 'buttoninput');
          assert.equal(inputButton.getAttribute('type'), 'button');

          const inputPasswordContainer = document.querySelector('.field_password');
          assert.equal(inputPasswordContainer.textContent, 'Passwort');
          const inputPassword = inputPasswordContainer.querySelector('.input-password');
          assert.equal(inputPassword.name, 'password');
          assert.equal(inputPassword.getAttribute('type'), 'password');

          const inputCheckboxContainer = document.querySelector('.field_checkbox');
          assert.equal(inputCheckboxContainer.textContent, 'Möglichkeiteingeloggt bleiben');
          const inputCheckbox = inputCheckboxContainer.querySelector('.input-checkbox');
          assert.equal(inputCheckbox.name, 'checkbox');
          assert.equal(inputCheckbox.value, 'stay');
          assert.equal(inputCheckbox.getAttribute('type'), 'checkbox');

          const inputRadioContainer = document.querySelector('.field_radio');
          assert.equal(inputRadioContainer.textContent, 'Auswahlmal klickenoder hier');
          const inputRadio = inputRadioContainer.querySelectorAll('.input-radio');
          assert.equal(inputRadio.length, 2);
          assert.equal(inputRadio[0].name, 'radio');
          assert.equal(inputRadio[0].value, 'klick');
          assert.equal(inputRadio[0].getAttribute('type'), 'radio');
          assert.equal(inputRadio[1].name, 'radio');
          assert.equal(inputRadio[1].value, 'klock');
          assert.equal(inputRadio[1].getAttribute('type'), 'radio');

          const inputSelectContainer = document.querySelector('.field_select');
          assert.equal(inputSelectContainer.textContent, 'Auswahllistebitte wählendiesdasvielleicht ein Pflichtfeld');
          const inputSelect = inputSelectContainer.querySelector('.input-select');
          assert.equal(inputSelect.name, 'select');
          const inputSelectOption = inputSelect.querySelectorAll('option');
          assert.equal(inputSelectOption.length, 3);
          assert.equal(inputSelectOption[0].value, '');
          assert.equal(inputSelectOption[0].textContent, 'bitte wählen');
          assert.equal(inputSelectOption[1].value, 'opt1');
          assert.equal(inputSelectOption[1].textContent, 'dies');
          assert.equal(inputSelectOption[2].value, 'opt2');
          assert.equal(inputSelectOption[2].textContent, 'das');

          const inputTextareaContainer = document.querySelector('.field_textareainput');
          assert.equal(inputTextareaContainer.textContent, 'Langtextfeldsteht schon was');
          const inputTextarea = inputTextareaContainer.querySelector('.input-textarea');
          assert.equal(inputTextarea.name, 'textareainput');

          const inputSubmitContainer = document.querySelector('.field_submit');
          const inputSubmit = inputSubmitContainer.querySelector('.input-submit');
          assert.equal(inputSubmit.getAttribute('type'), 'submit');
          assert.equal(inputSubmit.getAttribute('value'), 'anmelden');
          done();
        });
    });
  });
});
