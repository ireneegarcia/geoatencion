(function () {
  'use strict';

  angular
    .module('organisms')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
   /* menuService.addMenuItem('topbar', {
      title: 'Organisms',
      state: 'organisms',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'organisms', {
      title: 'List Organisms',
      state: 'organisms.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'organisms', {
      title: 'Create Organism',
      state: 'organisms.create',
      roles: ['*']
    });*/
  }
}());
