(function () {
  'use strict';

  angular
    .module('adminlogs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    /* menuService.addMenuItem('topbar', {
      title: 'Adminlogs',
      state: 'adminlogs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'adminlogs', {
      title: 'List Adminlogs',
      state: 'adminlogs.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'adminlogs', {
      title: 'Create Adminlog',
      state: 'adminlogs.create',
      roles: ['user']
    });*/
  }
}());
