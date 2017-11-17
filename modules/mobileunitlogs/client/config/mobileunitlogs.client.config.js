(function () {
  'use strict';

  angular
    .module('mobileunitlogs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    /* menuService.addMenuItem('topbar', {
      title: 'Mobileunitlogs',
      state: 'mobileunitlogs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'mobileunitlogs', {
      title: 'List Mobileunitlogs',
      state: 'mobileunitlogs.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'mobileunitlogs', {
      title: 'Create Mobileunitlog',
      state: 'mobileunitlogs.create',
      roles: ['user']
    });*/
  }
}());
