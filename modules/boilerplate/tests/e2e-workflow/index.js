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
    'Mobile': { width: 340, height: 568 },
    'Tablet': { width: 768, height: 1024 },
    'Desktop': { width: 1200, height: 900 }
  },
  testCases: {
    'Boilerplate': {
      uri: domain + '/boilerplate/?lang=de',
      steps: {
        'Index': {
          title: 'Boilerplate',
          elements: {
            '//h1[@id="headline"]': 'Boilerplate',
            '//*[contains(@class, "boilerplate-headline")]': 'Hier ist die Boilerplate',
            '//*[contains(@class, "form-link")]': 'Formular'
          },
          elementsNotExist: [
            '//form[@name="form"]',
            '//input[@type="text"][@name="textinput"]'
          ],
          click: 'a[href="/boilerplate/form/"]'
        },
        'Formular-Elemente': {
          title: 'Formular',
          elements: {
            '//h1[@id="headline"]': 'Boilerplate',
            '//h2[@class="subheadline"]': 'Formular',
            '//form[@class="form"][@name="sampleform"][@action="/boilerplate/form/"]': '',
            '//*[contains(@class, "fieldcontainer_textinput")]': 'Texteingabe',
            '//input[@type="text"][@name="textinput"]': '',
            '//*[contains(@class, "fieldcontainer_buttoninput")]': 'Button',
            '//input[@type="button"][@name="buttoninput"][@value="hier klicken"]': '',
            '//*[contains(@class, "fieldcontainer_passwordinput")]': 'Passwort',
            '//input[@type="password"][@name="passwordinput"]': '',
            '//*[contains(@class, "fieldcontainer_checkboxinput")]': 'Möglichkeit\nkann man wählen',
            '//input[@type="checkbox"][@name="checkboxinput"][@id="checkboxinput"][@value="checkbox checked"]': '',
            '//label[@for="checkboxinput"]': 'kann man wählen',
            '//*[contains(@class, "fieldcontainer_radioinput")]': 'Auswahl\nmal klickenoder hier',
            '//input[@type="radio"][@name="radioinput"][@id="radioinput0"][@value="checked first radio"]': '',
            '//label[@for="radioinput0"]': 'mal klicken',
            '//input[@type="radio"][@name="radioinput"][@id="radioinput1"][@value="checked second radio"]': '',
            '//label[@for="radioinput1"]': 'oder hier',
            '//*[contains(@class, "field_selectinput")]': 'Auswahlliste\n- bitte wählen -\ndies\ndas\nvielleicht ein Pflichtfeld',
            '//select[@name="selectinput"]': '- bitte wählen -\ndies\ndas',
            '//select[@name="selectinput"]/option[1][@value=""]': '- bitte wählen -',
            '//select[@name="selectinput"]/option[2][@value="opt1"]': 'dies',
            '//select[@name="selectinput"]/option[3][@value="opt2"]': 'das',
            '//*[@class="select-followtext"]': 'vielleicht ein Pflichtfeld',
            '//*[contains(@class, "field_textareainput")]': 'Langtextfeld\nsteht schon was',
            '//textarea[@name="textareainput"]': 'steht schon was',
            '//*[contains(@class, "field_groupOfFields")]': 'Feldgruppe\nmal klickenoder hier\n- bitte wählen -\nWahl 1\nWahl 2',
            '//*[contains(@class, "field_grouptextinput1")]': '',
            '//input[@type="text"][@name="grouptextinput1"]': '',
            '//*[contains(@class, "field_grouptextinput2")]': '',
            '//input[@type="text"][@name="grouptextinput2"]': '',
            '//*[contains(@class, "field_groupradioinput")]': 'mal klickenoder hier',
            '//input[@type="radio"][@name="groupradioinput"][@id="groupradioinput0"][@value="group first radio"]': '',
            '//label[@for="groupradioinput0"]': 'mal klicken',
            '//input[@type="radio"][@name="groupradioinput"][@id="groupradioinput1"][@value="group second radio"]': '',
            '//label[@for="groupradioinput1"]': 'oder hier',
            '//*[contains(@class, "field_groupselectinput")]': '- bitte wählen -\nWahl 1\nWahl 2',
            '//select[@name="groupselectinput"]': '- bitte wählen -\nWahl 1\nWahl 2',
            '//select[@name="groupselectinput"]/option[1][@value=""]': '- bitte wählen -',
            '//select[@name="groupselectinput"]/option[2][@value="option1"]': 'Wahl 1',
            '//select[@name="groupselectinput"]/option[3][@value="option2"]': 'Wahl 2',
            '//*[contains(@class, "field_address")]': 'Adresse',
            '//*[contains(@class, "field_address-street")]': '',
            '//input[@type="text"][@name="address-street"]': '',
            '//*[contains(@class, "field_address-housenumber")]': '',
            '//input[@type="text"][@name="address-housenumber"]': '',
            '//*[contains(@class, "field_address-zip")]': '',
            '//input[@type="text"][@name="address-zip"]': '',
            '//*[contains(@class, "field_address-city")]': '',
            '//input[@type="text"][@name="address-city"]': '',
            '//*[contains(@class, "fieldcontainer_submit")]': '',
            '//input[@type="submit"][@value="absenden"]': ''
          },
          input: {
            '//input[@name="textinput"]': 'Text-Eingabe',
            '//input[@name="passwordinput"]': 'somepassword',
            '//input[@type="checkbox"][@name="checkboxinput"]': true,
            '//input[@type="radio"][@name="radioinput"][2]': true,
            '//select[@name="selectinput"]/option[@value="opt2"]': true,
            '//textarea[@name="textareainput"]': 'jetzt steht hier was neues',
            '//input[@name="grouptextinput1"]': '12345',
            '//input[@name="radioinput"][2]': true,
            '//input[@name="groupradioinput"][@value="group first radio"]': true,
            '//select[@name="groupselectinput"]/option[@value="option1"]': true,
            '//input[@name="address-street"]': 'Beispielstraße',
            '//input[@name="address-housenumber"]': '17a',
            '//input[@name="address-zip"]': '01234',
            '//input[@name="address-city"]': 'Musterhausen'
          },
          click: '//input[@type="submit"][@value="absenden"]'
        },
        'Formular-Eingaben': {
          title: 'Formular',
          elements: {
            '//form[@class="form"][@name="sampleform"][@action="/boilerplate/form/"]': '',
            '//input[@type="text"][@name="textinput"][@value="Text-Eingabe"]': '',
            '//input[@type="password"][@name="passwordinput"][@value="somepassword"]': '',
            '//input[@type="checkbox"][@name="checkboxinput"][@checked]': '',
            '//input[@type="radio"][@name="radioinput"][2][@checked]': '',
            '//select[@name="selectinput"]/option[@value="opt2"][@selected]': '',
            '//textarea[@name="textareainput"]': 'jetzt steht hier was neues',
            '//input[@type="text"][@name="grouptextinput1"][@value="12345"]': '',
            '//input[@type="radio"][@name="groupradioinput"][1][@checked]': '',
            '//select[@name="groupselectinput"]/option[2][@value="option1"][@selected]': 'Wahl 1',
            '//input[@type="text"][@name="address-street"][@value="Beispielstraße"]': '',
            '//input[@type="text"][@name="address-housenumber"][@value="17a"]': '',
            '//input[@type="text"][@name="address-zip"][@value="01234"]': '',
            '//input[@type="text"][@name="address-city"][@value="Musterhausen"]': ''
          },
          elementsNotExist: [
            '//input[@type="radio"][@name="radioinput"][1][@checked]',
            '//input[@type="radio"][@name="groupradioinput"][2][@checked]'
          ]
        }
      }
    }
  }
};
