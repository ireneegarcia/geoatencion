'use strict';

describe('Branches E2E Tests:', function () {
  describe('Test Branches page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/branches');
      expect(element.all(by.repeater('branch in branches')).count()).toEqual(0);
    });
  });
});
