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
      get: {
        method: 'GET',
        isArray: false
      },
      update: {
        method: 'PUT'
      },
      near: {
        method: 'GET',
        isArray: true,
        url: '/api/networks/:lat/:lng/near'
      }
    });
  }

}());
