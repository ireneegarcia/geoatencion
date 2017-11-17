(function () {
  'use strict';

  angular
    .module('mobileunithistories')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Historia de unidades',
      state: 'mobileunithistories.list',
      // type: 'dropdown',
      roles: ['adminOrganism']
    });

    // Add the dropdown list item
    /* menuService.addSubMenuItem('topbar', 'mobileunithistories', {
      title: 'List Mobileunithistories',
      state: 'mobileunithistories.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'mobileunithistories', {
      title: 'Create Mobileunithistory',
      state: 'mobileunithistories.create',
      roles: ['user']
    });*/
  }
}());
