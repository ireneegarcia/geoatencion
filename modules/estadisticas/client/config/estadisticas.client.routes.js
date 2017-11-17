(function () {
  'use strict';

  angular
    .module('estadisticas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('estadisticas', {
        abstract: true,
        url: '/estadisticas',
        template: '<ui-view/>'
      })
      .state('estadisticas.list', {
        url: '',
        templateUrl: '/modules/estadisticas/client/views/list-estadisticas.client.view.html',
        controller: 'EstadisticasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Estadisticas List'
        }
      })
      .state('estadisticas.pdf', {
        url: '/pdf',
        templateUrl: '/modules/estadisticas/client/views/form-estadistica.client.view.html',
        controller: 'EstadisticasListController',
        controllerAs: 'vm',
        resolve: {
          estadisticaResolve: newEstadistica
        },
        data: {
          roles: ['organism', 'operator'],
          pageTitle: 'Estadisticas timeline'
        }
      })
      .state('estadisticas.edit', {
        url: '/:estadisticaId/edit',
        templateUrl: '/modules/estadisticas/client/views/form-estadistica.client.view.html',
        controller: 'EstadisticasController',
        controllerAs: 'vm',
        resolve: {
          estadisticaResolve: getEstadistica
        },
        data: {
          roles: ['organism', 'adminOrganism'],
          pageTitle: 'Edit Estadistica {{ estadisticaResolve.name }}'
        }
      })
      .state('estadisticas.view', {
        url: '/:estadisticaId',
        templateUrl: '/modules/estadisticas/client/views/view-estadistica.client.view.html',
        controller: 'EstadisticasController',
        controllerAs: 'vm',
        resolve: {
          estadisticaResolve: getEstadistica
        },
        data: {
          pageTitle: 'Estadistica {{ estadisticaResolve.name }}'
        }
      });
  }

  getEstadistica.$inject = ['$stateParams', 'EstadisticasService'];

  function getEstadistica($stateParams, EstadisticasService) {
    return EstadisticasService.get({
      estadisticaId: $stateParams.estadisticaId
    }).$promise;
  }

  newEstadistica.$inject = ['EstadisticasService'];

  function newEstadistica(EstadisticasService) {
    return new EstadisticasService();
  }
}());
