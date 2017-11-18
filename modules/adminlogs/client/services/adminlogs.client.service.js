// Adminlogs service used to communicate Adminlogs REST endpoints
(function () {
  'use strict';

  angular
    .module('adminlogs')
    .factory('AdminlogsService', AdminlogsService)
    .factory('AdminlogsServiceCreate', AdminlogsServiceCreate);

  AdminlogsService.$inject = ['$resource'];

  function AdminlogsService($resource) {
    return $resource('/api/adminlogs/:adminlogId', {
      adminlogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  AdminlogsServiceCreate.$inject = ['$resource'];

  function AdminlogsServiceCreate($resource) {
    return $resource('/api/adminlogs', {
      description: '@description',
      module: '@module',
      organism: '@organism',
    }, {
      charge: {
        method: 'POST'
      }
    });
  }
}());
