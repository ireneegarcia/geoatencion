(function () {
  'use strict';

  angular
    .module('mails')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Mails',
      state: 'mails',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'mails', {
      title: 'List Mails',
      state: 'mails.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'mails', {
      title: 'Redactar correo',
      state: 'mails.create',
      roles: ['organism', 'operator']
    });
  }
}());
