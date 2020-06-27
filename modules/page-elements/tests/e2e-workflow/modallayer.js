/**
 * Testdata for expressjs-boilerplate
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

const domain = 'http://boilerplate-server:8080';

module.exports = {
  group: 'Boilerplate E2E Test',
  name: 'Modal Layer Test',
  viewports: {
    // 'Mobile': { width: 340, height: 568 },
    'Tablet': { width: 768, height: 1024 }
    // 'Desktop': { width: 1200, height: 900 }
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
            '//span[contains(@class, "link")]',
            '//*[@id="modalLayer"]'
          ]
        },
        'hover Benutzer': {
          title: 'Boilerplate',
          hover: '//*[contains(@class, "login-status")]',
          elements: {
            '//*[contains(@class, "header-breadcrumbs")]': 'Home\nBoilerplate',
            '//*[contains(@class, "login-status")]': 'Benutzer\nanmelden\nregistrieren',
            '//span[contains(@class, "link")]': 'anmelden'
          },
          elementsNotVisible: [
            '//*[@id="modalLayer"]'
          ]
        },
        'click anmelden': {
          title: 'Boilerplate',
          hover: '//*[contains(@class, "loginLayer-link")]',
          elements: {
            '//*[contains(@class, "header-breadcrumbs")]': 'Home\nBoilerplate',
            '//*[contains(@class, "login-status")]': 'Benutzer\nanmelden\nregistrieren',
            '//span[contains(@class, "link")]': 'anmelden'
          },
          click: '//span[contains(@class, "loginLayer-link")]'
        },
        'show login form': {
          title: 'Boilerplate',
          waitForElements: [
            '//input[@type="checkbox"][@name="rememberMe"]',
            '//input[@type="submit"]'
          ],
          elements: {
            '//*[contains(@class, "header-breadcrumbs")]': 'Home\nBoilerplate',
            '//*[contains(@class, "login-status")]': 'Benutzer',
            '//*[@id="modalLayer"]': ''
          },
          elementsNotVisible: [
            '//span[contains(@class, "link")]'
          ],
          input: {
            '//input[@name="username"]': 'TestUser',
            '//input[@name="password"]': 'TestPassword',
            '//input[@type="checkbox"][@name="rememberMe"]': true
          },
          click: '//input[@type="submit"]'
        },
        'show login Success': {
          title: 'Formular',
          elements: {
            '//*[contains(@class, "header-breadcrumbs")]': 'Home\nBoilerplate\nFormular',
            '//*[contains(@class, "login-status")]': 'Benutzer',
            '//*[@id="postdata"]': '{\n  "username": "TestUser",\n  "password": "TestPassword",\n  "rememberMe": "store"\n}',
            '//span[contains(@class, "link")]': '',
            '//*[@id="modalLayer"]': ''
          },
          elementsNotVisible: [
            '//span[contains(@class, "link")]',
            '//*[@id="modalLayer"]'
          ]
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
            '//*[contains(@class, "login-status")]': 'User\nlogin\nsign up',
            '//span[contains(@class, "link")]': 'login'
          },
          click: '//span[contains(@class, "link")]'
        }
      }
    }
  }
};
