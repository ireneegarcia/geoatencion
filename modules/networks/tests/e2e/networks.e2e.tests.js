'use strict';

describe('Networks E2E Tests:', function () {
  describe('Test Networks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/networks');
      expect(element.all(by.repeater('network in networks')).count()).toEqual(0);
    });
  });
});
