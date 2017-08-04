// Catalogos service used to communicate Catalogos REST endpoints
(function () {
  'use strict';

  angular
    .module('catalogos')
    .factory('CatalogosService', CatalogosService);

  CatalogosService.$inject = ['$resource'];

  function CatalogosService($resource) {
    return $resource('/api/catalogos/:catalogoId', {
      catalogoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
