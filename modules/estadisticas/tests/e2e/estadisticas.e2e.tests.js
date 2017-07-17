'use strict';

describe('Estadisticas E2E Tests:', function () {
  describe('Test Estadisticas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/estadisticas');
      expect(element.all(by.repeater('estadistica in estadisticas')).count()).toEqual(0);
    });
  });
});
