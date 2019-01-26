/**
 * Testdata for expressjs-boilerplate
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

const domain = 'http://expressjs-boilerplate-e2e:8080';

module.exports = {
  group: 'Boilerplate E2E Test',
  name: 'Index',
  viewports: {
    'Mobile': { width: 340, height: 568 },
    'Tablet': { width: 768, height: 1024 },
    'Desktop': { width: 1200, height: 900 }
  },
  testCases: {
    'Index': {
      uri: domain + '/boilerplate/',
      steps: {
        'Boilerplate': {
          title: 'Boilerplate',
          elements: {
            '//h1[@id="headline"]': 'Boilerplate',
            '//*[contains(@class, "boilerplate-headline")]': 'Welcome to Boilerplate',
            '//*[contains(@class, "form-link")]': 'Formular'
          },
          elementsNotExist: [
            '//a[@id="editButton"]'
          ],
          click: 'a[href="/boilerplate/form/"]'
        },
        'Formular start': {
          title: 'Formular',
          elements: {
            '//*[contains(@class, "field_textinput")]': 'Texteingabe'
          }
        }
      }
    }
  }
};
