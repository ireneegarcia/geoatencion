// Alarmas service used to communicate Alarmas REST endpoints
(function () {
  'use strict';

  angular
    .module('alarmas')
    .factory('AlarmasService', AlarmasService);

  AlarmasService.$inject = ['$resource'];

  function AlarmasService($resource) {
    return $resource('/api/alarmas/:alarmaId', {
      alarmaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
