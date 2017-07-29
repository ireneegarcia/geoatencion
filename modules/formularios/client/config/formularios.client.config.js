(function () {
  'use strict';

  angular
    .module('formularios')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    /* menuService.addMenuItem('topbar', {
      title: 'Formularios',
      state: 'formularios',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'formularios', {
      title: 'List Formularios',
      state: 'formularios.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'formularios', {
      title: 'Create Formulario',
      state: 'formularios.create',
      roles: ['user']
    });*/
  }
}());
