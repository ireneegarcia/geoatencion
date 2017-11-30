// Mobileunitlogs service used to communicate Mobileunitlogs REST endpoints
(function () {
  'use strict';

  angular
    .module('mobileunitlogs')
    .factory('MobileunitlogsService', MobileunitlogsService)
    .factory('MobileunitlogsServiceCreate', MobileunitlogsServiceCreate);

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

  MobileunitlogsServiceCreate.$inject = ['$resource'];

  function MobileunitlogsServiceCreate($resource) {
    return $resource('/api/mobileunitlogs', {
      mobileUnit: '@mobileUnit',
      mobileUnitCarCode: '@mobileUnitCarCode',
      description: '@description'
    }, {
      charge: {
        method: 'POST'
      }
    });
  }

}());
