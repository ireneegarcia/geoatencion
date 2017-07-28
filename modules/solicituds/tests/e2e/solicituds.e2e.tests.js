'use strict';

describe('Solicituds E2E Tests:', function () {
  describe('Test Solicituds page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/solicituds');
      expect(element.all(by.repeater('solicitud in solicituds')).count()).toEqual(0);
    });
  });
});
