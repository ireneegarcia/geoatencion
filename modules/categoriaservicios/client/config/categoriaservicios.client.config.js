(function () {
  'use strict';

  angular
    .module('categoriaservicios')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Categoria servicios',
      state: 'categoriaservicios',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'categoriaservicios', {
      title: 'Listado de categorías',
      state: 'categoriaservicios.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'categoriaservicios', {
      title: 'Crear categoría',
      state: 'categoriaservicios.create',
      roles: ['admin']
    });
  }
}());
