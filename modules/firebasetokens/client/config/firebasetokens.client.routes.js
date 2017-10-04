(function () {
  'use strict';

  angular
    .module('firebasetokens')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('firebasetokens', {
        abstract: true,
        url: '/firebasetokens',
        template: '<ui-view/>'
      })
      .state('firebasetokens.list', {
        url: '',
        templateUrl: '/modules/firebasetokens/client/views/list-firebasetokens.client.view.html',
        controller: 'FirebasetokensListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Firebasetokens List'
        }
      })
      .state('firebasetokens.create', {
        url: '/create',
        templateUrl: '/modules/firebasetokens/client/views/form-firebasetoken.client.view.html',
        controller: 'FirebasetokensController',
        controllerAs: 'vm',
        resolve: {
          firebasetokenResolve: newFirebasetoken
        },
        data: {
          roles: ['user', 'admin', 'guest', 'operator'],
          pageTitle: 'Firebasetokens Create'
        }
      })
      .state('firebasetokens.edit', {
        url: '/:firebasetokenId/edit',
        templateUrl: '/modules/firebasetokens/client/views/form-firebasetoken.client.view.html',
        controller: 'FirebasetokensController',
        controllerAs: 'vm',
        resolve: {
          firebasetokenResolve: getFirebasetoken
        },
        data: {
          roles: ['user', 'admin', 'guest', 'operator'],
          pageTitle: 'Edit Firebasetoken {{ firebasetokenResolve.name }}'
        }
      })
      .state('firebasetokens.view', {
        url: '/:firebasetokenId',
        templateUrl: '/modules/firebasetokens/client/views/view-firebasetoken.client.view.html',
        controller: 'FirebasetokensController',
        controllerAs: 'vm',
        resolve: {
          firebasetokenResolve: getFirebasetoken
        },
        data: {
          pageTitle: 'Firebasetoken {{ firebasetokenResolve.name }}'
        }
      });
  }

  getFirebasetoken.$inject = ['$stateParams', 'FirebasetokensService'];

  function getFirebasetoken($stateParams, FirebasetokensService) {
    return FirebasetokensService.get({
      firebasetokenId: $stateParams.firebasetokenId
    }).$promise;
  }

  newFirebasetoken.$inject = ['FirebasetokensService'];

  function newFirebasetoken(FirebasetokensService) {
    return new FirebasetokensService();
  }
}());
