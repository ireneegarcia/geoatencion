// Firebasetokens service used to communicate Firebasetokens REST endpoints
(function () {
  'use strict';

  angular
    .module('firebasetokens')
    .factory('FirebasetokensService', FirebasetokensService)
    .factory('FirebasetokensServiceCreate', FirebasetokensServiceCreate);

  FirebasetokensService.$inject = ['$resource'];

  function FirebasetokensService($resource) {
    return $resource('/api/firebasetokens/:firebasetokenId', {
      firebasetokenId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  FirebasetokensServiceCreate.$inject = ['$resource'];

  function FirebasetokensServiceCreate($resource) {
    return $resource('/api/firebasetokens', {
      token: '@token',
      userId: '@userId'
    }, {
      charge: {
        method: 'POST'
      }
    });
  }
}());
