(function () {
  'use strict';

  angular
    .module('branches')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    /* menuService.addMenuItem('topbar', {
      title: 'Branches',
      state: 'branches',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'branches', {
      title: 'List Branches',
      state: 'branches.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'branches', {
      title: 'Create Branch',
      state: 'branches.create',
      roles: ['user']
    });*/
  }
}());
