(function () {
  'use strict';

  angular
    .module('organisms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('organisms', {
        abstract: true,
        url: '/organisms',
        template: '<ui-view/>'
      })
      .state('organisms.list', {
        url: '',
        templateUrl: '/modules/organisms/client/views/list-organisms.client.view.html',
        controller: 'OrganismsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Organisms List'
        }
      })
      .state('organisms.create', {
        url: '/create',
        templateUrl: '/modules/organisms/client/views/form-organism.client.view.html',
        controller: 'OrganismsController',
        controllerAs: 'vm',
        resolve: {
          organismResolve: newOrganism
        },
        data: {
          pageTitle: 'Organisms Create'
        }
      })
      .state('organisms.edit', {
        url: '/:organismId/edit',
        templateUrl: '/modules/organisms/client/views/form-organism.client.view.html',
        controller: 'OrganismsController',
        controllerAs: 'vm',
        resolve: {
          organismResolve: getOrganism
        },
        data: {
          roles: ['adminOrganism'],
          pageTitle: 'Edit Organism {{ organismResolve.name }}'
        }
      })
      .state('organisms.view', {
        url: '/:organismId',
        templateUrl: '/modules/organisms/client/views/view-organism.client.view.html',
        controller: 'OrganismsController',
        controllerAs: 'vm',
        resolve: {
          organismResolve: getOrganism
        },
        data: {
          pageTitle: 'Organism {{ organismResolve.name }}'
        }
      });
  }

  getOrganism.$inject = ['$stateParams', 'OrganismsService'];

  function getOrganism($stateParams, OrganismsService) {
    return OrganismsService.get({
      organismId: $stateParams.organismId
    }).$promise;
  }

  newOrganism.$inject = ['OrganismsService'];

  function newOrganism(OrganismsService) {
    return new OrganismsService();
  }
}());
