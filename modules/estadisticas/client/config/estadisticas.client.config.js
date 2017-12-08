(function () {
  'use strict';

  angular
    .module('estadisticas')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Estadisticas',
      state: 'estadisticas.list',
      roles: ['organism', 'adminOrganism']
    });

    menuService.addMenuItem('topbar', {
      title: 'Log',
      state: 'log',
      type: 'dropdown',
      roles: ['organism', 'adminOrganism']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'log', {
      title: 'Unidades',
      state: 'mobileunithistories.list'
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'log', {
      title: 'Administrativo',
      state: 'adminlogs.list'
    });
  }
}());
