(function () {
  'use strict';

  angular
    .module('solicituds')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Afiliación',
      state: 'solicituds',
      type: 'dropdown',
      roles: ['organism', 'user', 'adminOrganism']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'solicituds', {
      title: 'Mis afiliaciones',
      state: 'solicituds.list',
      roles: ['*']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'solicituds', {
      title: 'Nueva afiliación',
      state: 'solicituds.create',
      roles: ['user']
    });
  }
}());
