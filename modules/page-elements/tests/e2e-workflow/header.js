/**
 * Testdata for expressjs-boilerplate
 *
 * @module modules/page-elements/tests/e2e-workflow/header
 */

const domain = 'http://boilerplate-server:8080';

module.exports = {
  group: 'Boilerplate E2E Test',
  name: 'Boilerplate Header Test',
  viewports: {
    // 'Mobile': { width: 340, height: 568 },
    // 'Tablet': { width: 768, height: 1024 },
    'Desktop': { width: 1200, height: 900 }
  },
  testCases: {
    'Header DE': {
      uri: domain + '/boilerplate/?lang=de',
      steps: {
        'default': {
          title: 'Boilerplate',
          elements: {
            '//*[contains(@class, "header-breadcrumbs")]': 'Home\nBoilerplate',
            '//*[contains(@class, "login-status")]': 'Benutzer',
            '//span[contains(@class, "link")][contains(., "anmelden")]': ''
          },
          elementsNotVisible: [
            '//span[contains(@class, "link")]'
          ]
        },
        'hover login-status': {
          title: 'Boilerplate',
          hover: '//*[contains(@class, "login-status")]',
          elements: {
            '//*[contains(@class, "header-breadcrumbs")]': 'Home\nBoilerplate',
            '//*[contains(@class, "login-status")]': 'Benutzer\nNicht angemeldet\nanmelden\nregistrieren',
            '//span[contains(@class, "link")]': 'anmelden'
          },
          click: '//span[contains(@class, "link")]'
        }
      }
    },
    'Header EN': {
      uri: domain + '/boilerplate/?lang=en',
      steps: {
        'default': {
          title: 'Boilerplate',
          elements: {
            '//*[contains(@class, "header-breadcrumbs")]': 'Home\nBoilerplate',
            '//*[contains(@class, "login-status")]': 'User',
            '//span[contains(@class, "link")][contains(., "login")]': ''
          },
          elementsNotVisible: [
            '//span[contains(@class, "link")]'
          ]
        },
        'hover login-status': {
          title: 'Boilerplate',
          hover: '//*[contains(@class, "login-status")]',
          elements: {
            '//*[contains(@class, "header-breadcrumbs")]': 'Home\nBoilerplate',
            '//*[contains(@class, "login-status")]': 'User\nNot logged in\nlogin\nsign up',
            '//span[contains(@class, "link")]': 'login'
          },
          click: '//span[contains(@class, "link")]'
        }
      }
    }
  }
};
