'use strict';

describe('Categoriaservicios E2E Tests:', function () {
  describe('Test Categoriaservicios page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/categoriaservicios');
      expect(element.all(by.repeater('categoriaservicio in categoriaservicios')).count()).toEqual(0);
    });
  });
});
