(function () {
  'use strict';

  angular
    .module('catalogos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('catalogos', {
        abstract: true,
        url: '/catalogos',
        template: '<ui-view/>'
      })
      .state('catalogos.list', {
        url: '',
        templateUrl: '/modules/catalogos/client/views/list-catalogos.client.view.html',
        controller: 'CatalogosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Catalogos List'
        }
      })
      .state('catalogos.create', {
        url: '/create',
        templateUrl: '/modules/catalogos/client/views/form-catalogo.client.view.html',
        controller: 'CatalogosController',
        controllerAs: 'vm',
        resolve: {
          catalogoResolve: newCatalogo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Catalogos Create'
        }
      })
      .state('catalogos.edit', {
        url: '/:catalogoId/edit',
        templateUrl: '/modules/catalogos/client/views/form-catalogo.client.view.html',
        controller: 'CatalogosController',
        controllerAs: 'vm',
        resolve: {
          catalogoResolve: getCatalogo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Catalogo {{ catalogoResolve.name }}'
        }
      })
      .state('catalogos.view', {
        url: '/:catalogoId',
        templateUrl: '/modules/catalogos/client/views/view-catalogo.client.view.html',
        controller: 'CatalogosController',
        controllerAs: 'vm',
        resolve: {
          catalogoResolve: getCatalogo
        },
        data: {
          pageTitle: 'Catalogo {{ catalogoResolve.name }}'
        }
      });
  }

  getCatalogo.$inject = ['$stateParams', 'CatalogosService'];

  function getCatalogo($stateParams, CatalogosService) {
    return CatalogosService.get({
      catalogoId: $stateParams.catalogoId
    }).$promise;
  }

  newCatalogo.$inject = ['CatalogosService'];

  function newCatalogo(CatalogosService) {
    return new CatalogosService();
  }
}());
