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
      state: 'estadisticas',
      type: 'dropdown',
      roles: ['organism', 'adminOrganism']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'estadisticas', {
      title: 'Ver estadisticas',
      state: 'estadisticas.list'
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'estadisticas', {
      title: 'Historia de unidades',
      state: 'mobileunithistories.list',
      // type: 'dropdown',
      roles: ['adminOrganism']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'estadisticas', {
      title: 'PDF',
      state: 'estadisticas.pdf',
      roles: ['organism', 'operator', 'adminOrganism']
    });
  }
}());
