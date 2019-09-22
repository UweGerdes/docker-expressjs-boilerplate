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
  app = 'https://localhost:8443';

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
          document = getDocument(res, err);
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
          testElement('.headline', { }, 'Boilerplate');
          testElement('.subheadline', { }, 'Formular');
          done();
        });
    });
    it('should have form and elements', function (done) {
      chai.request('http://localhost:8080')
        .get('/boilerplate/form/')
        .end(function (err, res) {
          document = getDocument(res, err);
          testElement('.form', {
            name: 'sampleform',
            method: 'POST',
            action: '/boilerplate/form/'
          }, null);
          testElement('[name=hiddeninput]', {
            name: 'hiddeninput',
            type: 'hidden',
            value: 'some hidden value'
          }, null);
          testElement('.fieldcontainer_textinput', { }, 'Texteingabe');
          testElement('.fieldcontainer_textinput .input-text', {
            name: 'textinput', type: 'text', value: 'ändern!', placeholder: 'bitte Text eingeben'
          }, null);
          testElement('.fieldcontainer_passwordinput', { }, 'Passwort');
          testElement('.fieldcontainer_passwordinput .input-password', {
            name: 'passwordinput',
            type: 'password'
          }, null);
          testElement('.field_textareainput', { }, 'Langtextfeldsteht schon was');
          testElement('.field_textareainput .input-textarea', {
            name: 'textareainput',
            placeholder: 'bitte viel Text eingeben'
          }, 'steht schon was');
          testElement('.fieldcontainer_buttoninput', { }, 'Button');
          testElement('.fieldcontainer_buttoninput .input-button', {
            name: 'buttoninput',
            type: 'button',
            value: 'hier klicken'
          }, null);
          testElement('.fieldcontainer_checkboxinput', { }, 'Möglichkeitkann man wählen');
          testElement('.fieldcontainer_checkboxinput .input-checkbox', {
            name: 'checkboxinput',
            type: 'checkbox',
            value: 'checkbox checked'
          }, null);
          testElement('.fieldcontainer_radioinput', { }, 'Auswahlmal klickenoder hier');
          testElement('.fieldcontainer_radioinput [for=radioinput0]', { }, 'mal klicken');
          testElement('.fieldcontainer_radioinput .input-radio:nth-of-type(1)', {
            name: 'radioinput',
            type: 'radio',
            value: 'checked first radio'
          }, null);
          testElement('.fieldcontainer_radioinput [for=radioinput1]', { }, 'oder hier');
          testElement('.fieldcontainer_radioinput .input-radio:nth-of-type(2)', {
            name: 'radioinput',
            type: 'radio',
            value: 'checked second radio'
          }, null);
          testElement('.fieldcontainer_selectinput', { }, 'Auswahlliste- bitte wählen -diesdasvielleicht ein Pflichtfeld');
          testElement('.fieldcontainer_selectinput .input-select', { name: 'selectinput' }, null);
          testElement('.fieldcontainer_selectinput .input-select option:nth-of-type(1)', { value: '' }, '- bitte wählen -');
          testElement('.fieldcontainer_selectinput .input-select option:nth-of-type(2)', { value: 'opt1' }, 'dies');
          testElement('.fieldcontainer_selectinput .input-select option:nth-of-type(3)', { value: 'opt2' }, 'das');
          testElement('.fieldcontainer_selectinput .select-label', { }, 'vielleicht ein Pflichtfeld');
          testElement('.field_groupOfFields', { }, 'Feldgruppemal klickenoder hier- bitte wählen -Wahl 1Wahl 2');
          testElement('.field_groupOfFields .field_grouptextinput1 .input-text', { name: 'grouptextinput1' }, null);
          testElement('.field_groupOfFields .field_grouptextinput2 .input-text', {
            name: 'grouptextinput2',
            placeholder: 'Text in Gruppenfeld eintragen'
          }, null);
          testElement('.field_groupradioinput [for=groupradioinput0]', { }, 'mal klicken');
          testElement('.field_groupradioinput .input-radio:nth-of-type(1)', {
            name: 'groupradioinput',
            type: 'radio',
            value: 'group first radio'
          }, null);
          testElement('.field_groupradioinput [for=groupradioinput1]', { }, 'oder hier');
          testElement('.field_groupradioinput .input-radio:nth-of-type(2)', {
            name: 'groupradioinput',
            type: 'radio',
            value: 'group second radio'
          }, null);
          testElement('.field_groupselectinput', { }, '- bitte wählen -Wahl 1Wahl 2');
          testElement('.field_groupselectinput .input-select', { name: 'groupselectinput' }, null);
          testElement('.field_groupselectinput .input-select option:nth-of-type(1)', { value: '' }, '- bitte wählen -');
          testElement('.field_groupselectinput .input-select option:nth-of-type(2)', { value: 'option1' }, 'Wahl 1');
          testElement('.field_groupselectinput .input-select option:nth-of-type(3)', { value: 'option2' }, 'Wahl 2');
          testElement('.field_address', { }, 'Adresse');
          testElement('.field_address .field_address-street .input-text', { name: 'address-street' }, null);
          testElement('.field_address .field_address-housenumber .input-text', { name: 'address-housenumber' }, null);
          testElement('.field_address .field_address-zip .input-text', { name: 'address-zip' }, null);
          testElement('.field_address .field_address-city .input-text', { name: 'address-city' }, null);
          testElement('.fieldcontainer_submit', { }, '');
          testElement('.fieldcontainer_submit .input-submit', {
            type: 'submit',
            value: 'absenden'
          }, null);
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
            textinput: 'changed content',
            passwordinput: 'password',
            textareainput: 'Langtexteingabe',
            checkboxinput: 'checkbox checked',
            radioinput: 'checked second radio',
            selectinput: 'opt1',
            grouptextinput1: 'text1',
            grouptextinput2: 'text2',
            groupradioinput: 'group first radio',
            groupselectinput: 'option2',
            'address-street': 'Str.',
            'address-housenumber': '1',
            'address-zip': '12345',
            'address-city': 'Wohnort'
          });
      } catch (error) {
        err = error;
      }
      document = getDocument(res, err);
      checkPage(document, 'Formular', 'anmelden');
      testError();
      testElement('.fieldcontainer_textinput .input-text', { name: 'textinput', type: 'text', value: 'changed content' }, null);
      testElement('.fieldcontainer_passwordinput .input-password', { name: 'passwordinput', type: 'password', value: 'password' }, null);
      testElement('.field_textareainput .input-textarea', { name: 'textareainput' }, 'Langtexteingabe');
      testElement('.fieldcontainer_checkboxinput .input-checkbox', {
        name: 'checkboxinput', type: 'checkbox', value: 'checkbox checked', checked: 'checked'
      }, null);
      testElement('.fieldcontainer_radioinput .input-radio:nth-of-type(2)', {
        name: 'radioinput', type: 'radio', value: 'checked second radio', checked: 'checked'
      }, null);
      testElement('.fieldcontainer_selectinput .input-select option:nth-of-type(2)', { value: 'opt1', selected: 'selected' }, 'dies');
      testElement('.field_groupOfFields .field_grouptextinput1 .input-text', { name: 'grouptextinput1', value: 'text1' }, null);
      testElement('.field_groupOfFields .field_grouptextinput2 .input-text', { name: 'grouptextinput2', value: 'text2' }, null);
      testElement('.field_groupradioinput .input-radio:nth-of-type(1)', {
        name: 'groupradioinput', type: 'radio', value: 'group first radio', checked: 'checked'
      }, null);
      testElement('.field_groupselectinput .input-select option:nth-of-type(3)', { value: 'option2', selected: 'selected' }, 'Wahl 2');
      testElement('.field_address .field_address-street .input-text', { name: 'address-street', value: 'Str.' }, null);
      testElement('.field_address .field_address-housenumber .input-text', { name: 'address-housenumber', value: '1' }, null);
      testElement('.field_address .field_address-zip .input-text', { name: 'address-zip', value: '12345' }, null);
      testElement('.field_address .field_address-city .input-text', { name: 'address-city', value: 'Wohnort' }, null);
      const postdata = document.querySelectorAll('#postdata');
      assert.equal(postdata.length, 1);
      const data = JSON.parse(postdata[0].textContent);
      assert.equal(data.textinput, 'changed content');
      assert.equal(data.passwordinput, 'password');
      assert.equal(data.textareainput, 'Langtexteingabe');
      assert.equal(data.checkboxinput, 'checkbox checked');
      assert.equal(data.radioinput, 'checked second radio');
      assert.equal(data.selectinput, 'opt1');
      assert.equal(data.grouptextinput1, 'text1');
      assert.equal(data.grouptextinput2, 'text2');
      assert.equal(data.groupradioinput, 'group first radio');
      assert.equal(data.groupselectinput, 'option2');
      assert.equal(data['address-street'], 'Str.');
      assert.equal(data['address-housenumber'], '1');
      assert.equal(data['address-zip'], '12345');
      assert.equal(data['address-city'], 'Wohnort');
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
