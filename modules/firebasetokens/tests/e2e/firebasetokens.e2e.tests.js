'use strict';

describe('Firebasetokens E2E Tests:', function () {
  describe('Test Firebasetokens page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/firebasetokens');
      expect(element.all(by.repeater('firebasetoken in firebasetokens')).count()).toEqual(0);
    });
  });
});
