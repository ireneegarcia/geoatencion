(function () {
  'use strict';

  angular
    .module('catalogos')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Catalogos',
      state: 'catalogos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'catalogos', {
      title: 'List Catalogos',
      state: 'catalogos.list'
    });

    /*// Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'catalogos', {
      title: 'Create Catalogo',
      state: 'catalogos.create',
      roles: ['user']
    });*/
  }
}());
