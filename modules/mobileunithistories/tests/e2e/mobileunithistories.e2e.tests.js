'use strict';

describe('Mobileunithistories E2E Tests:', function () {
  describe('Test Mobileunithistories page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/mobileunithistories');
      expect(element.all(by.repeater('mobileunithistory in mobileunithistories')).count()).toEqual(0);
    });
  });
});
