(function () {
  'use strict';

  angular
    .module('alarmas')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Alarmas',
      state: 'alarmas',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'alarmas', {
      title: 'List Alarmas',
      state: 'alarmas.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'alarmas', {
      title: 'Create Alarma',
      state: 'alarmas.create',
      roles: ['admin']
    });
  }
}());
