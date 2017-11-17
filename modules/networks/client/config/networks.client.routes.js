(function () {
  'use strict';

  angular
    .module('networks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('user-list-networks', {
        url: '/user-list-networks',
        templateUrl: 'modules/networks/client/views/user-list-networks.client.view.html',
        controller: 'UserListNetworksController',
        controllerAs: 'vm',
        data: {
          roles: ['organism', 'operator', 'adminOrganism']
        }
      })
      .state('networks', {
        abstract: true,
        url: '/networks',
        template: '<ui-view/>'
      })
      .state('networks.list', {
        url: '',
        templateUrl: '/modules/networks/client/views/list-networks.client.view.html',
        controller: 'NetworksListController',
        controllerAs: 'vm',
        data: {
          roles: ['organism', 'operator', 'adminOrganism'],
          pageTitle: 'Networks List'
        }
      })
      .state('networks.create', {
        url: '/create',
        templateUrl: '/modules/networks/client/views/form-network.client.view.html',
        controller: 'NetworksController',
        controllerAs: 'vm',
        resolve: {
          networkResolve: newNetwork
        },
        data: {
          roles: ['organism', 'adminOrganism'],
          pageTitle: 'Networks Create'
        }
      })
      .state('networks.edit', {
        url: '/:networkId/edit',
        templateUrl: '/modules/networks/client/views/form-network.client.view.html',
        controller: 'NetworksController',
        controllerAs: 'vm',
        resolve: {
          networkResolve: getNetwork
        },
        data: {
          roles: ['organism', 'adminOrganism'],
          pageTitle: 'Edit Network {{ networkResolve.name }}'
        }
      })
      .state('networks.view', {
        url: '/:networkId',
        templateUrl: '/modules/networks/client/views/view-network.client.view.html',
        controller: 'NetworksController',
        controllerAs: 'vm',
        resolve: {
          networkResolve: getNetwork
        },
        data: {
          roles: ['organism', 'operator', 'adminOrganism'],
          pageTitle: 'Network {{ networkResolve.name }}'
        }
      })
      .state('authentication.operator', {
        url: '/signup-operator',
        templateUrl: '/modules/users/client/views/authentication/signup.operator.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup',
          roles: ['organism', 'adminOrganism']
        }
      })
      .state('authentication.userService', {
        url: '/signup-service',
        templateUrl: '/modules/users/client/views/authentication/signup.userService.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup',
          roles: ['organism', 'adminOrganism']
        }
      })
    ;
  }

  getNetwork.$inject = ['$stateParams', 'NetworksService'];

  function getNetwork($stateParams, NetworksService) {
    return NetworksService.get({
      networkId: $stateParams.networkId
    }).$promise;
  }

  newNetwork.$inject = ['NetworksService'];

  function newNetwork(NetworksService) {
    return new NetworksService();
  }
}());
