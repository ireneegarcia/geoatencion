'use strict';

describe('Adminlogs E2E Tests:', function () {
  describe('Test Adminlogs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adminlogs');
      expect(element.all(by.repeater('adminlog in adminlogs')).count()).toEqual(0);
    });
  });
});
