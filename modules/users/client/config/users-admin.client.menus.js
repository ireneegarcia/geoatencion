(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar usuarios',
      state: 'admin.users'
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Consultar formularios',
      state: 'formularios.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Crear formulario',
      state: 'formularios.create',
      roles: ['admin']
    });

  }
}());
