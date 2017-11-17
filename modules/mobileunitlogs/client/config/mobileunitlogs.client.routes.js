(function () {
  'use strict';

  angular
    .module('mobileunitlogs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mobileunitlogs', {
        abstract: true,
        url: '/mobileunitlogs',
        template: '<ui-view/>'
      })
      .state('mobileunitlogs.list', {
        url: '',
        templateUrl: '/modules/mobileunitlogs/client/views/list-mobileunitlogs.client.view.html',
        controller: 'MobileunitlogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mobileunitlogs List'
        }
      })
      .state('mobileunitlogs.create', {
        url: '/create',
        templateUrl: '/modules/mobileunitlogs/client/views/form-mobileunitlog.client.view.html',
        controller: 'MobileunitlogsController',
        controllerAs: 'vm',
        resolve: {
          mobileunitlogResolve: newMobileunitlog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mobileunitlogs Create'
        }
      })
      .state('mobileunitlogs.edit', {
        url: '/:mobileunitlogId/edit',
        templateUrl: '/modules/mobileunitlogs/client/views/form-mobileunitlog.client.view.html',
        controller: 'MobileunitlogsController',
        controllerAs: 'vm',
        resolve: {
          mobileunitlogResolve: getMobileunitlog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Mobileunitlog {{ mobileunitlogResolve.name }}'
        }
      })
      .state('mobileunitlogs.view', {
        url: '/:mobileunitlogId',
        templateUrl: '/modules/mobileunitlogs/client/views/view-mobileunitlog.client.view.html',
        controller: 'MobileunitlogsController',
        controllerAs: 'vm',
        resolve: {
          mobileunitlogResolve: getMobileunitlog
        },
        data: {
          pageTitle: 'Mobileunitlog {{ mobileunitlogResolve.name }}'
        }
      });
  }

  getMobileunitlog.$inject = ['$stateParams', 'MobileunitlogsService'];

  function getMobileunitlog($stateParams, MobileunitlogsService) {
    return MobileunitlogsService.get({
      mobileunitlogId: $stateParams.mobileunitlogId
    }).$promise;
  }

  newMobileunitlog.$inject = ['MobileunitlogsService'];

  function newMobileunitlog(MobileunitlogsService) {
    return new MobileunitlogsService();
  }
}());
