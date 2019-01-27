/**
 * Testdata for expressjs-boilerplate
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

const domain = 'http://expressjs-boilerplate-e2e:8080';

module.exports = {
  group: 'Boilerplate E2E Test',
  name: 'Boilerplate',
  viewports: {
    // 'Mobile': { width: 340, height: 568 },
    'Tablet': { width: 768, height: 1024 }
    // , 'Desktop': { width: 1200, height: 900 }
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
            '//h1[@id="headline"]': 'Boilerplate',
            '//h2[@class="subheadline"]': 'Formular',
            '//*[contains(@class, "field_textinput")]': 'Texteingabe',
            '//input[@type="text"][@name="textinput"]': '',
            '//*[contains(@class, "field_buttoninput")]': 'Button',
            '//input[@type="button"][@name="buttoninput"][@value="hier klicken"]': '',
            '//*[contains(@class, "field_passwordinput")]': 'Passwort',
            '//input[@type="password"][@name="passwordinput"]': '',
            '//*[contains(@class, "field_checkboxinput")]': 'Möglichkeit\nkann man wählen',
            '//input[@type="checkbox"][@name="checkboxinput"][@id="checkboxinput"][@value="gewählt"]': '',
            '//label[@for="checkboxinput"]': 'kann man wählen',
            '//*[contains(@class, "field_radioinput")]': 'Auswahl\nmal klickenoder hier',
            '//input[@type="radio"][@name="radioinput"][@id="radioinput0"][@value="klick"]': '',
            '//label[@for="radioinput0"]': 'mal klicken',
            '//input[@type="radio"][@name="radioinput"][@id="radioinput1"][@value="klock"]': '',
            '//label[@for="radioinput1"]': 'oder hier',
            '//*[contains(@class, "field_select")]': 'Auswahlliste\nbitte wählen\ndies\ndas\nvielleicht ein Pflichtfeld',
            '//select[@name="select"]': 'bitte wählen\ndies\ndas',
            '//select[@name="select"]/option[1][@value=""]': 'bitte wählen',
            '//select[@name="select"]/option[2][@value="opt1"]': 'dies',
            '//select[@name="select"]/option[3][@value="opt2"]': 'das',
            '//*[@class="select-followtext"]': 'vielleicht ein Pflichtfeld',
            '//*[contains(@class, "field_textareainput")]': 'Langtextfeld\nsteht schon was',
            '//textarea[@name="textareainput"]': 'steht schon was',
            '//*[contains(@class, "field_group1")]': 'Feldgruppe\nmal klickenoder hier',
            '//*[contains(@class, "field_grouptextinput1")]': '',
            '//input[@type="text"][@name="grouptextinput1"]': '',
            '//*[contains(@class, "field_grouptextinput2")]': '',
            '//input[@type="text"][@name="grouptextinput2"]': '',
            '//*[contains(@class, "field_groupradioinput")]': 'mal klickenoder hier',
            '//input[@type="radio"][@name="groupradioinput"][@id="groupradioinput0"][@value="klick"]': '',
            '//label[@for="radioinput0"]': 'mal klicken',
            '//input[@type="radio"][@name="groupradioinput"][@id="groupradioinput1"][@value="klock"]': '',
            '//label[@for="radioinput1"]': 'oder hier'
          }
        }
      }
    }
  }
};
