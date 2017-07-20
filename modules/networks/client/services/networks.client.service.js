// Networks service used to communicate Networks REST endpoints
(function () {
  'use strict';

  angular
    .module('networks')
    .factory('NetworksService', NetworksService);

  NetworksService.$inject = ['$resource'];

  function NetworksService($resource) {
    return $resource('/api/networks/:networkId', {
      networkId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
