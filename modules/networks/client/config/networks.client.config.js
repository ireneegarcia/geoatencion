(function () {
  'use strict';

  angular
    .module('networks')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Network',
      state: 'networks',
      type: 'dropdown',
      roles: ['organism', 'operator']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Lista de unidades',
      state: 'networks.list',
      roles: ['organism', 'operator']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Lista de trabajadores',
      state: 'user-list-networks',
      roles: ['organism', 'operator']
    });

    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Registrar operador',
      state: 'authentication.operator',
      roles: ['organism']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Registrar unidad de atención',
      state: 'networks.create',
      roles: ['organism']
    });

    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Registrar responsable de atención',
      state: 'authentication.userService',
      roles: ['organism']
    });

  }
}());
