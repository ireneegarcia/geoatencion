(function () {
  'use strict';

  angular
    .module('panels')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items

    // Add the dropdown list item
    menuService.addMenuItem('topbar', {
      title: 'Mapa',
      state: 'panels.list',
      roles: ['operator']
    });

    // Add the dropdown list item
    menuService.addMenuItem('topbar', {
      title: 'Mapa',
      state: 'panels.organism',
      roles: ['organism', 'adminOrganism']
    });

  }
}());
