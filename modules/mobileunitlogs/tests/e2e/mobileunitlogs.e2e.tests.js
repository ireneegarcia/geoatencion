'use strict';

describe('Mobileunitlogs E2E Tests:', function () {
  describe('Test Mobileunitlogs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/mobileunitlogs');
      expect(element.all(by.repeater('mobileunitlog in mobileunitlogs')).count()).toEqual(0);
    });
  });
});
