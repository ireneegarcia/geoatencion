// Branches service used to communicate Branches REST endpoints
(function () {
  'use strict';

  angular
    .module('branches')
    .factory('BranchesService', BranchesService)
    .factory('BranchesServiceCreate', BranchesServiceCreate);

  BranchesService.$inject = ['$resource'];

  function BranchesService($resource) {
    return $resource('/api/branches/:branchId', {
      branchId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  BranchesServiceCreate.$inject = ['$resource'];

  function BranchesServiceCreate($resource) {
    return $resource('/api/branches', {
      location: '@location'
    }, {
      charge: {
        method: 'POST'
      }
    });
  }
}());
