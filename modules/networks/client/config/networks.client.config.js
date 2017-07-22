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
      roles: ['organism']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Lista de unidades',
      state: 'networks.list',
      roles: ['organism']
    });

    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Incluir operador',
      state: 'authentication.operator',
      roles: ['organism']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Incluir unidad de atención',
      state: 'networks.create',
      roles: ['organism']
    });

    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Incluir responsable de atención',
      state: 'authentication.userService',
      roles: ['organism']
    });

  }
}());
