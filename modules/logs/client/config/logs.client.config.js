(function () {
  'use strict';

  angular
    .module('logs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
     /* menuService.addMenuItem('topbar', {
      title: 'Logs',
      state: 'logs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'logs', {
      title: 'List Logs',
      state: 'logs.list',
      roles: ['*']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'logs', {
      title: 'Create Log',
      state: 'logs.create',
      roles: ['user']
    });*/
  }
}());
