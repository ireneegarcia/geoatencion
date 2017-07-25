(function () {
  'use strict';

  angular
    .module('alarmas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('alarmas', {
        abstract: true,
        url: '/alarmas',
        template: '<ui-view/>'
      })
      .state('alarmas.list', {
        url: '',
        templateUrl: '/modules/alarmas/client/views/list-alarmas.client.view.html',
        controller: 'AlarmasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Alarmas List'
        }
      })
      .state('alarmas.create', {
        url: '/create',
        templateUrl: '/modules/alarmas/client/views/form-alarma.client.view.html',
        controller: 'AlarmasController',
        controllerAs: 'vm',
        resolve: {
          alarmaResolve: newAlarma
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Alarmas Create'
        }
      })
      .state('alarmas.edit', {
        url: '/:alarmaId/edit',
        templateUrl: '/modules/alarmas/client/views/form-alarma.client.view.html',
        controller: 'AlarmasController',
        controllerAs: 'vm',
        resolve: {
          alarmaResolve: getAlarma
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Alarma {{ alarmaResolve.name }}'
        }
      })
      .state('alarmas.view', {
        url: '/:alarmaId',
        templateUrl: '/modules/alarmas/client/views/view-alarma.client.view.html',
        controller: 'AlarmasController',
        controllerAs: 'vm',
        resolve: {
          alarmaResolve: getAlarma
        },
        data: {
          pageTitle: 'Alarma {{ alarmaResolve.name }}'
        }
      });
  }

  getAlarma.$inject = ['$stateParams', 'AlarmasService'];

  function getAlarma($stateParams, AlarmasService) {
    return AlarmasService.get({
      alarmaId: $stateParams.alarmaId
    }).$promise;
  }

  newAlarma.$inject = ['AlarmasService'];

  function newAlarma(AlarmasService) {
    return new AlarmasService();
  }
}());
