// Solicituds service used to communicate Solicituds REST endpoints
(function () {
  'use strict';

  angular
    .module('solicituds')
    .factory('SolicitudsService', SolicitudsService);

  SolicitudsService.$inject = ['$resource'];

  function SolicitudsService($resource) {
    return $resource('/api/solicituds/:solicitudId', {
      solicitudId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
