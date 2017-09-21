(function () {
  'use strict';

  angular
    .module('branches')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('branches', {
        abstract: true,
        url: '/branches',
        template: '<ui-view/>'
      })
      .state('branches.list', {
        url: '',
        templateUrl: '/modules/branches/client/views/list-branches.client.view.html',
        controller: 'BranchesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Branches List'
        }
      })
      .state('branches.create', {
        url: '/create',
        templateUrl: '/modules/branches/client/views/form-branch.client.view.html',
        controller: 'BranchesController',
        controllerAs: 'vm',
        resolve: {
          branchResolve: newBranch
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Branches Create'
        }
      })
      .state('branches.edit', {
        url: '/:branchId/edit',
        templateUrl: '/modules/branches/client/views/form-branch.client.view.html',
        controller: 'BranchesController',
        controllerAs: 'vm',
        resolve: {
          branchResolve: getBranch
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Branch {{ branchResolve.name }}'
        }
      })
      .state('branches.view', {
        url: '/:branchId',
        templateUrl: '/modules/branches/client/views/view-branch.client.view.html',
        controller: 'BranchesController',
        controllerAs: 'vm',
        resolve: {
          branchResolve: getBranch
        },
        data: {
          pageTitle: 'Branch {{ branchResolve.name }}'
        }
      });
  }

  getBranch.$inject = ['$stateParams', 'BranchesService'];

  function getBranch($stateParams, BranchesService) {
    return BranchesService.get({
      branchId: $stateParams.branchId
    }).$promise;
  }

  newBranch.$inject = ['BranchesService'];

  function newBranch(BranchesService) {
    return new BranchesService();
  }
}());
