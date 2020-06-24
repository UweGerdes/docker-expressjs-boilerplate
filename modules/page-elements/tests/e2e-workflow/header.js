/**
 * Testdata for expressjs-boilerplate
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

const domain = 'http://boilerplate-server:8080';

module.exports = {
  group: 'Boilerplate E2E Test',
  name: 'Header Test',
  viewports: {
    'Mobile': { width: 340, height: 568 },
    'Tablet': { width: 768, height: 1024 },
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
            '//a[@href="/login/"][contains(., "anmelden")]': ''
          },
          elementsNotVisible: [
            '//a[@href="/login/"]'
          ]
        },
        'hover login-status': {
          title: 'Boilerplate',
          hover: '//*[contains(@class, "login-status")]',
          elements: {
            '//*[contains(@class, "header-breadcrumbs")]': 'Home\nBoilerplate',
            '//*[contains(@class, "login-status")]': 'Benutzer\nanmelden\nregistrieren',
            '//a[@href="/login/"]': 'anmelden'
          },
          click: '//a[@href="/login/"]'
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
            '//a[@href="/login/"][contains(., "login")]': ''
          },
          elementsNotVisible: [
            '//a[@href="/login/"]'
          ]
        },
        'hover login-status': {
          title: 'Boilerplate',
          hover: '//*[contains(@class, "login-status")]',
          elements: {
            '//*[contains(@class, "header-breadcrumbs")]': 'Home\nBoilerplate',
            '//*[contains(@class, "login-status")]': 'User\nlogin\nsign up',
            '//a[@href="/login/"]': 'login'
          },
          click: '//a[@href="/login/"]'
        }
      }
    }
  }
};
