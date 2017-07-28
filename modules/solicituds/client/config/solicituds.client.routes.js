(function () {
  'use strict';

  angular
    .module('solicituds')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('solicituds', {
        abstract: true,
        url: '/solicituds',
        template: '<ui-view/>'
      })
      .state('solicituds.list', {
        url: '',
        templateUrl: '/modules/solicituds/client/views/list-solicituds.client.view.html',
        controller: 'SolicitudsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Solicituds List'
        }
      })
      .state('solicituds.create', {
        url: '/create',
        templateUrl: '/modules/solicituds/client/views/form-solicitud.client.view.html',
        controller: 'SolicitudsController',
        controllerAs: 'vm',
        resolve: {
          solicitudResolve: newSolicitud
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Solicituds Create'
        }
      })
      .state('solicituds.edit', {
        url: '/:solicitudId/edit',
        templateUrl: '/modules/solicituds/client/views/form-solicitud.client.view.html',
        controller: 'SolicitudsController',
        controllerAs: 'vm',
        resolve: {
          solicitudResolve: getSolicitud
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Solicitud {{ solicitudResolve.name }}'
        }
      })
      .state('solicituds.view', {
        url: '/:solicitudId',
        templateUrl: '/modules/solicituds/client/views/view-solicitud.client.view.html',
        controller: 'SolicitudsController',
        controllerAs: 'vm',
        resolve: {
          solicitudResolve: getSolicitud
        },
        data: {
          pageTitle: 'Solicitud {{ solicitudResolve.name }}'
        }
      });
  }

  getSolicitud.$inject = ['$stateParams', 'SolicitudsService'];

  function getSolicitud($stateParams, SolicitudsService) {
    return SolicitudsService.get({
      solicitudId: $stateParams.solicitudId
    }).$promise;
  }

  newSolicitud.$inject = ['SolicitudsService'];

  function newSolicitud(SolicitudsService) {
    return new SolicitudsService();
  }
}());
