'use strict';

describe('Alarms E2E Tests:', function () {
  describe('Test Alarms page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/alarms');
      expect(element.all(by.repeater('alarm in alarms')).count()).toEqual(0);
    });
  });
});
