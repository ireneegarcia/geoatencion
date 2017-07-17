// Estadisticas service used to communicate Estadisticas REST endpoints
(function () {
  'use strict';

  angular
    .module('estadisticas')
    .factory('EstadisticasService', EstadisticasService);

  EstadisticasService.$inject = ['$resource'];

  function EstadisticasService($resource) {
    return $resource('/api/estadisticas/:estadisticaId', {
      estadisticaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
