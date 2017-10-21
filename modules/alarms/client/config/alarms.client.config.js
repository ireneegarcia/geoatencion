(function () {
  'use strict';

  angular
    .module('alarms')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items


    menuService.addMenuItem('topbar', {
      title: 'Alarmas',
      state: 'alarms.list',
      roles: ['operator']
    });

    menuService.addMenuItem('topbar', {
      title: 'Calificar',
      state: 'alarms.rating',
      roles: ['user']
    });

  }
}());
