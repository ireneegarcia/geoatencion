(function () {
  'use strict';

  angular
    .module('mobileunithistories')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mobileunithistories', {
        abstract: true,
        url: '/mobileunithistories',
        template: '<ui-view/>'
      })
      .state('mobileunithistories.list', {
        url: '',
        templateUrl: '/modules/mobileunithistories/client/views/list-mobileunithistories.client.view.html',
        controller: 'MobileunithistoriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mobileunithistories List'
        }
      })
      .state('mobileunithistories.create', {
        url: '/create',
        templateUrl: '/modules/mobileunithistories/client/views/form-mobileunithistory.client.view.html',
        controller: 'MobileunithistoriesController',
        controllerAs: 'vm',
        resolve: {
          mobileunithistoryResolve: newMobileunithistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mobileunithistories Create'
        }
      })
      .state('mobileunithistories.edit', {
        url: '/:mobileunithistoryId/edit',
        templateUrl: '/modules/mobileunithistories/client/views/form-mobileunithistory.client.view.html',
        controller: 'MobileunithistoriesController',
        controllerAs: 'vm',
        resolve: {
          mobileunithistoryResolve: getMobileunithistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Mobileunithistory {{ mobileunithistoryResolve.name }}'
        }
      })
      .state('mobileunithistories.view', {
        url: '/:mobileunithistoryId',
        templateUrl: '/modules/mobileunithistories/client/views/view-mobileunithistory.client.view.html',
        controller: 'MobileunithistoriesController',
        controllerAs: 'vm',
        resolve: {
          mobileunithistoryResolve: getMobileunithistory
        },
        data: {
          pageTitle: 'Mobileunithistory {{ mobileunithistoryResolve.name }}'
        }
      });
  }

  getMobileunithistory.$inject = ['$stateParams', 'MobileunithistoriesService'];

  function getMobileunithistory($stateParams, MobileunithistoriesService) {
    return MobileunithistoriesService.get({
      mobileunithistoryId: $stateParams.mobileunithistoryId
    }).$promise;
  }

  newMobileunithistory.$inject = ['MobileunithistoriesService'];

  function newMobileunithistory(MobileunithistoriesService) {
    return new MobileunithistoriesService();
  }
}());
