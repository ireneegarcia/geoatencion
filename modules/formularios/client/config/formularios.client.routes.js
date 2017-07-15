(function () {
  'use strict';

  angular
    .module('formularios')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('formularios', {
        abstract: true,
        url: '/formularios',
        template: '<ui-view/>'
      })
      .state('formularios.list', {
        url: '',
        templateUrl: '/modules/formularios/client/views/list-formularios.client.view.html',
        controller: 'FormulariosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Formularios List'
        }
      })
      .state('formularios.create', {
        url: '/create',
        templateUrl: '/modules/formularios/client/views/form-formulario.client.view.html',
        controller: 'FormulariosController',
        controllerAs: 'vm',
        resolve: {
          formularioResolve: newFormulario
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Formularios Create'
        }
      })
      .state('formularios.edit', {
        url: '/:formularioId/edit',
        templateUrl: '/modules/formularios/client/views/form-formulario.client.view.html',
        controller: 'FormulariosController',
        controllerAs: 'vm',
        resolve: {
          formularioResolve: getFormulario
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Formulario {{ formularioResolve.name }}'
        }
      })
      .state('formularios.view', {
        url: '/:formularioId',
        templateUrl: '/modules/formularios/client/views/view-formulario.client.view.html',
        controller: 'FormulariosController',
        controllerAs: 'vm',
        resolve: {
          formularioResolve: getFormulario
        },
        data: {
          pageTitle: 'Formulario {{ formularioResolve.name }}'
        }
      });
  }

  getFormulario.$inject = ['$stateParams', 'FormulariosService'];

  function getFormulario($stateParams, FormulariosService) {
    return FormulariosService.get({
      formularioId: $stateParams.formularioId
    }).$promise;
  }

  newFormulario.$inject = ['FormulariosService'];

  function newFormulario(FormulariosService) {
    return new FormulariosService();
  }
}());
