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

    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar organismos',
      state: 'admin.organism'
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar formularios',
      state: 'formularios.list'
    });

    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar categorías',
      state: 'categoriaservicios.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Crear formulario',
      state: 'formularios.create',
      roles: ['admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Crear categoría',
      state: 'categoriaservicios.create',
      roles: ['admin']
    });
  }
}());
