// Categoriaservicios service used to communicate Categoriaservicios REST endpoints
(function () {
  'use strict';

  angular
    .module('categoriaservicios')
    .factory('CategoriaserviciosService', CategoriaserviciosService);

  CategoriaserviciosService.$inject = ['$resource'];

  function CategoriaserviciosService($resource) {
    return $resource('/api/categoriaservicios/:categoriaservicioId', {
      categoriaservicioId: '@_id'
    }, {
      query: {
        method: 'GET',
        isArray: true
      },
      update: {
        method: 'PUT'
      }
    });
  }
}());
