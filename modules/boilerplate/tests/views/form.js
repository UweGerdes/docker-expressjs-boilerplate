/**
 * Test for boilerplate form elements and fill post data structure when submitted
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
  document,
  err = null;

describe('/boilerplate/tests/views/form.js', function () {
  describe('GET /boilerplate/form/', function () {
    it('should have head, script and headline', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          assert.equal(document.title, 'Formular');
          assert.equal(document.head.getElementsByTagName('link').length, 2);
          assert.equal(
            document.head.getElementsByTagName('link')[0].attributes.rel.nodeValue,
            'stylesheet'
          );
          assert.equal(
            document.head.getElementsByTagName('link')[0].attributes.href.nodeValue,
            '/app.css'
          );
          assert.equal(
            document.head.getElementsByTagName('link')[1].attributes.rel.nodeValue,
            'stylesheet'
          );
          assert.equal(
            document.head.getElementsByTagName('link')[1].attributes.href.nodeValue,
            '/boilerplate/layout.css'
          );
          assert.equal(document.head.getElementsByTagName('script').length, 1);
          assert.equal(
            document.head.getElementsByTagName('script')[0].attributes.src.nodeValue,
            '/boilerplate/script.js'
          );
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'Boilerplate');
          const subHeadline = document.querySelector('.subheadline');
          assert.equal(subHeadline.textContent, 'Formular');
          done();
        });
    });
    it('should have form', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const form = document.querySelector('form');
          assert.equal(form.getAttribute('method'), 'POST');
          assert.equal(form.getAttribute('action'), '/boilerplate/form/');
          done();
        });
    });
    it('should have text input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputTextContainer = document.querySelector('.field_textinput');
          assert.equal(inputTextContainer.textContent, 'Texteingabe');
          const inputText = inputTextContainer.querySelector('.input-text');
          assert.equal(inputText.name, 'textinput');
          assert.equal(inputText.getAttribute('type'), 'text');
          assert.equal(inputText.getAttribute('value'), 'ändern!');
          done();
        });
    });
    it('should have hidden input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputHidden = document.querySelector('[name=hiddeninput]');
          assert.equal(inputHidden.name, 'hiddeninput');
          assert.equal(inputHidden.value, 'wert');
          assert.equal(inputHidden.getAttribute('type'), 'hidden');
          done();
        });
    });
    it('should have text button widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputButtonContainer = document.querySelector('.field_buttoninput');
          assert.equal(inputButtonContainer.textContent, 'Button');
          const inputButton = inputButtonContainer.querySelector('.input-button');
          assert.equal(inputButton.name, 'buttoninput');
          assert.equal(inputButton.getAttribute('type'), 'button');
          done();
        });
    });
    it('should have password input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputPasswordContainer = document.querySelector('.field_passwordinput');
          assert.equal(inputPasswordContainer.textContent, 'Passwort');
          const inputPassword = inputPasswordContainer.querySelector('.input-password');
          assert.equal(inputPassword.name, 'passwordinput');
          assert.equal(inputPassword.getAttribute('type'), 'password');
          done();
        });
    });
    it('should have checkbox input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputCheckboxContainer = document.querySelector('.field_checkboxinput');
          assert.equal(inputCheckboxContainer.textContent, 'Möglichkeitkann man wählen');
          const inputCheckbox = inputCheckboxContainer.querySelector('.input-checkbox');
          assert.equal(inputCheckbox.name, 'checkboxinput');
          assert.equal(inputCheckbox.value, 'gewählt');
          assert.equal(inputCheckbox.getAttribute('type'), 'checkbox');
          done();
        });
    });
    it('should have radio input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputRadioContainer = document.querySelector('.field_radioinput');
          assert.equal(inputRadioContainer.textContent, 'Auswahlmal klickenoder hier');
          const inputRadio = inputRadioContainer.querySelectorAll('.input-radio');
          assert.equal(inputRadio.length, 2);
          assert.equal(inputRadio[0].name, 'radioinput');
          assert.equal(inputRadio[0].value, 'klick');
          assert.equal(inputRadio[0].getAttribute('type'), 'radio');
          assert.equal(inputRadio[1].name, 'radioinput');
          assert.equal(inputRadio[1].value, 'klock');
          assert.equal(inputRadio[1].getAttribute('type'), 'radio');
          done();
        });
    });
    it('should have select input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
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
          done();
        });
    });
    it('should have textarea input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputTextareaContainer = document.querySelector('.field_textareainput');
          assert.equal(inputTextareaContainer.textContent, 'Langtextfeldsteht schon was');
          const inputTextarea = inputTextareaContainer.querySelector('.input-textarea');
          assert.equal(inputTextarea.name, 'textareainput');
          done();
        });
    });
    it('should have field group input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputGroupContainer = document.querySelector('.field_group1');
          assert.equal(inputGroupContainer.textContent, 'Feldgruppemal klickenoder hier- bitte wählen -Wahl 1Wahl 2');
          const inputText1 = inputGroupContainer.querySelector('.field_grouptextinput1 .input-text');
          assert.equal(inputText1.name, 'grouptextinput1');
          const inputText2 = inputGroupContainer.querySelector('.field_grouptextinput2 .input-text');
          assert.equal(inputText2.name, 'grouptextinput2');
          const inputRadio = inputGroupContainer.querySelectorAll('.field_groupradioinput .input-radio');
          assert.equal(inputRadio.length, 2);
          assert.equal(inputRadio[0].name, 'groupradioinput');
          const selectOptions = inputGroupContainer.querySelectorAll('.field_groupselect option');
          assert.equal(selectOptions.length, 3);
          assert.equal(selectOptions[0].value, '');
          assert.equal(selectOptions[0].textContent, '- bitte wählen -');
          assert.equal(selectOptions[1].value, 'option1');
          assert.equal(selectOptions[1].textContent, 'Wahl 1');
          assert.equal(selectOptions[2].value, 'option2');
          assert.equal(selectOptions[2].textContent, 'Wahl 2');
          done();
        });
    });
    it('should have field address input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputGroupContainer = document.querySelector('.field_address');
          assert.equal(inputGroupContainer.textContent, 'Adresse');
          const inputStreet = inputGroupContainer.querySelector('.field_address-street .input-text');
          assert.equal(inputStreet.name, 'address-street');
          const inputHousenumber = inputGroupContainer.querySelector('.field_address-housenumber .input-text');
          assert.equal(inputHousenumber.name, 'address-housenumber');
          const inputZip = inputGroupContainer.querySelector('.field_address-zip .input-text');
          assert.equal(inputZip.name, 'address-zip');
          const inputCity = inputGroupContainer.querySelector('.field_address-city .input-text');
          assert.equal(inputCity.name, 'address-city');
          done();
        });
    });
    it('should have submit input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputSubmitContainer = document.querySelector('.field_submit');
          const inputSubmit = inputSubmitContainer.querySelector('.input-submit');
          assert.equal(inputSubmit.getAttribute('type'), 'submit');
          assert.equal(inputSubmit.getAttribute('value'), 'absenden');
          done();
        });
    });
    it('should have submit input widget', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          const document = getDocument(res, err);
          const inputSubmitContainer = document.querySelector('.field_submit');
          const inputSubmit = inputSubmitContainer.querySelector('.input-submit');
          assert.equal(inputSubmit.getAttribute('type'), 'submit');
          assert.equal(inputSubmit.getAttribute('value'), 'absenden');
          done();
        });
    });
  });
  describe('POST /boilerplate/form/', () => {
    it('should fill textinput value and show submitted data', async () => {
      try {
        res = await agent.post('/boilerplate/form/')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            textinput: 'changed content'
          });
      } catch (error) {
        err = error;
      }
      document = checkResponse(res, err);
      checkPage(document, 'Formular', 'anmelden');
      testError();
      testElement('.input-text', { name: 'textinput', type: 'text', value: 'changed content' }, null);
      const postdata = document.querySelectorAll('#postdata');
      assert.equal(postdata.length, 1);
      const data = JSON.parse(postdata[0].textContent);
      assert.equal(data.textinput, 'changed content');
    });
  });
});

function getDocument (res, err) {
  expect(err).to.be.null;
  expect(res).to.have.status(200);
  expect(res).to.be.html;
  return (new JSDOM(res.text)).window.document;
}

function checkResponse (res, err) {
  expect(err).to.be.null;
  expect(res).to.have.status(200);
  expect(res).to.be.html;
  return (new JSDOM(res.text)).window.document;
}

function checkPage (document, title, loginStatusLabel) {
  assert.equal(document.title, title);
  const loginStatus = document.querySelectorAll('.login-status');
  assert.equal(loginStatus.length, 1);
  assert.equal(loginStatus[0].textContent, loginStatusLabel);
}

/**
 * Test error message in document
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
