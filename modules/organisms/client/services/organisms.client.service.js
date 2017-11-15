// Organisms service used to communicate Organisms REST endpoints
(function () {
  'use strict';

  angular
    .module('organisms')
    .factory('OrganismsService', OrganismsService);

  OrganismsService.$inject = ['$resource'];

  function OrganismsService($resource) {
    return $resource('/api/organisms/:organismId', {
      organismId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
