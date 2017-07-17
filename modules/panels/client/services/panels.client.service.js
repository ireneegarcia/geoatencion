// Panels service used to communicate Panels REST endpoints
(function () {
  'use strict';

  angular
    .module('panels')
    .factory('PanelsService', PanelsService);

  PanelsService.$inject = ['$resource'];

  function PanelsService($resource) {
    return $resource('/api/panels/:panelId', {
      panelId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
