(function () {
  'use strict';

  angular
    .module('panels')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Panels',
      state: 'panels',
      type: 'dropdown',
      roles: ['organism','operator']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'panels', {
      title: 'List Panels',
      state: 'panels.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'panels', {
      title: 'Create Panel',
      state: 'panels.create',
      roles: ['organism','operator']
    });
  }
}());
