(function () {
  'use strict';

  angular
    .module('firebasetokens')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Firebasetokens',
      state: 'firebasetokens',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'firebasetokens', {
      title: 'List Firebasetokens',
      state: 'firebasetokens.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'firebasetokens', {
      title: 'Create Firebasetoken',
      state: 'firebasetokens.create',
      roles: ['user']
    });
  }
}());
