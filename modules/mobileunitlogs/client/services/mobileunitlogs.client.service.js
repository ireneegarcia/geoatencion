// Mobileunitlogs service used to communicate Mobileunitlogs REST endpoints
(function () {
  'use strict';

  angular
    .module('mobileunitlogs')
    .factory('MobileunitlogsService', MobileunitlogsService);

  MobileunitlogsService.$inject = ['$resource'];

  function MobileunitlogsService($resource) {
    return $resource('/api/mobileunitlogs/:mobileunitlogId', {
      mobileunitlogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
