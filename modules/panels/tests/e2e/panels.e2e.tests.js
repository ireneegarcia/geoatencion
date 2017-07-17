'use strict';

describe('Panels E2E Tests:', function () {
  describe('Test Panels page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/panels');
      expect(element.all(by.repeater('panel in panels')).count()).toEqual(0);
    });
  });
});
