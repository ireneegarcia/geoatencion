// Organisms service used to communicate Organisms REST endpoints
(function () {
  'use strict';

  angular
    .module('organisms')
    .factory('OrganismsService', OrganismsService)
    .factory('OrganismsServiceCreate', OrganismsServiceCreate);

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

  OrganismsServiceCreate.$inject = ['$resource'];

  function OrganismsServiceCreate($resource) {
    return $resource('/api/organisms', {
      name: '@name',
      rif: '@rif',
      phone: '@phone',
      category: '@category',
      email: '@email',
      country: '@country',
      address: '@address'
    }, {
      charge: {
        method: 'POST'
      }
    });
  }
}());
