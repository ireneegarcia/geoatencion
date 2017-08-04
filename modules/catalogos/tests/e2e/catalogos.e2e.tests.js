'use strict';

describe('Catalogos E2E Tests:', function () {
  describe('Test Catalogos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/catalogos');
      expect(element.all(by.repeater('catalogo in catalogos')).count()).toEqual(0);
    });
  });
});
