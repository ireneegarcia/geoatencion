(function () {
  'use strict';

  angular
    .module('solicituds')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Solicituds',
      state: 'solicituds',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'solicituds', {
      title: 'List Solicituds',
      state: 'solicituds.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'solicituds', {
      title: 'Create Solicitud',
      state: 'solicituds.create',
      roles: ['user']
    });
  }
}());
