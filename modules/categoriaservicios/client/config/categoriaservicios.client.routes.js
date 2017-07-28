(function () {
  'use strict';

  angular
    .module('categoriaservicios')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('categoriaservicios', {
        abstract: true,
        url: '/categoriaservicios',
        template: '<ui-view/>'
      })
      .state('categoriaservicios.list', {
        url: '',
        templateUrl: '/modules/categoriaservicios/client/views/list-categoriaservicios.client.view.html',
        controller: 'CategoriaserviciosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Categoriaservicios List'
        }
      })
      .state('categoriaservicios.create', {
        url: '/create',
        templateUrl: '/modules/categoriaservicios/client/views/form-categoriaservicio.client.view.html',
        controller: 'CategoriaserviciosController',
        controllerAs: 'vm',
        resolve: {
          categoriaservicioResolve: newCategoriaservicio
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Categoriaservicios Create'
        }
      })
      .state('categoriaservicios.edit', {
        url: '/:categoriaservicioId/edit',
        templateUrl: '/modules/categoriaservicios/client/views/form-categoriaservicio.client.view.html',
        controller: 'CategoriaserviciosController',
        controllerAs: 'vm',
        resolve: {
          categoriaservicioResolve: getCategoriaservicio
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Categoriaservicio {{ categoriaservicioResolve.name }}'
        }
      })
      .state('categoriaservicios.view', {
        url: '/:categoriaservicioId',
        templateUrl: '/modules/categoriaservicios/client/views/view-categoriaservicio.client.view.html',
        controller: 'CategoriaserviciosController',
        controllerAs: 'vm',
        resolve: {
          categoriaservicioResolve: getCategoriaservicio
        },
        data: {
          pageTitle: 'Categoriaservicio {{ categoriaservicioResolve.name }}'
        }
      });
  }

  getCategoriaservicio.$inject = ['$stateParams', 'CategoriaserviciosService'];

  function getCategoriaservicio($stateParams, CategoriaserviciosService) {
    return CategoriaserviciosService.get({
      categoriaservicioId: $stateParams.categoriaservicioId
    }).$promise;
  }

  newCategoriaservicio.$inject = ['CategoriaserviciosService'];

  function newCategoriaservicio(CategoriaserviciosService) {
    return new CategoriaserviciosService();
  }
}());
