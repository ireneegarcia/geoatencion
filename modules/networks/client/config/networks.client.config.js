(function () {
  'use strict';

  angular
    .module('networks')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Equipo de trabajo',
      state: 'networks',
      type: 'dropdown',
      roles: ['organism', 'operator', 'adminOrganism']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Lista de unidades',
      state: 'networks.list',
      roles: ['organism', 'operator', 'adminOrganism']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Lista de trabajadores',
      state: 'user-list-networks',
      roles: ['organism', 'operator', 'adminOrganism']
    });

    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Registrar trabajador',
      state: 'authentication.operator',
      roles: ['organism', 'adminOrganism']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Registrar unidad de atención',
      state: 'networks.create',
      roles: ['organism', 'adminOrganism']
    });

    /* menuService.addSubMenuItem('topbar', 'networks', {
      title: 'Registrar responsable de atención',
      state: 'authentication.userService',
      roles: ['organism', 'adminOrganism']
    });*/

  }
}());
