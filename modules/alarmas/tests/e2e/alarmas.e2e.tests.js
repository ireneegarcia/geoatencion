'use strict';

describe('Alarmas E2E Tests:', function () {
  describe('Test Alarmas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/alarmas');
      expect(element.all(by.repeater('alarma in alarmas')).count()).toEqual(0);
    });
  });
});
