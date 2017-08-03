// Formularios service used to communicate Formularios REST endpoints
(function () {
  'use strict';

  angular
    .module('formularios')
    .factory('FormulariosService', FormulariosService);

  FormulariosService.$inject = ['$resource'];

  function FormulariosService($resource) {
    return $resource('/api/formularios/:formularioId', {
      formularioId: '@_id'
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
