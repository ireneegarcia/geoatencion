'use strict';

describe('Formularios E2E Tests:', function () {
  describe('Test Formularios page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/formularios');
      expect(element.all(by.repeater('formulario in formularios')).count()).toEqual(0);
    });
  });
});
