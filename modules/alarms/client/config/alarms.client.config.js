(function () {
  'use strict';

  angular
    .module('alarms')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Alarmas',
      state: 'alarms',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'alarms', {
      title: 'Listado de alarmas',
      state: 'alarms.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'alarms', {
      title: 'Create Alarm',
      state: 'alarms.create',
      roles: ['*']
    });
  }
}());