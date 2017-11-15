'use strict';

describe('Organisms E2E Tests:', function () {
  describe('Test Organisms page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/organisms');
      expect(element.all(by.repeater('organism in organisms')).count()).toEqual(0);
    });
  });
});
