// Mobileunithistories service used to communicate Mobileunithistories REST endpoints
(function () {
  'use strict';

  angular
    .module('mobileunithistories')
    .factory('MobileunithistoriesService', MobileunithistoriesService);

  MobileunithistoriesService.$inject = ['$resource'];

  function MobileunithistoriesService($resource) {
    return $resource('/api/mobileunithistories/:mobileunithistoryId', {
      mobileunithistoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
