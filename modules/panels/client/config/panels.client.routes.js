(function () {
  'use strict';

  angular
    .module('panels')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('panel-map-client-view-html', {
        url: '/panel-map-client-view-html',
        templateUrl: 'modules/panels/client/views/panel-map-client-view-html.client.view.html',
        controller: 'PanelsListController',
        controllerAs: 'vm'
      })
      .state('panels', {
        abstract: true,
        url: '/panels',
        template: '<ui-view/>'
      })
      .state('panels.list', {
        url: '',
        templateUrl: '/modules/panels/client/views/list-panels.client.view.html',
        controller: 'PanelsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Panels List'
        }
      })
      .state('panels.create', {
        url: '/create',
        templateUrl: '/modules/panels/client/views/form-panel.client.view.html',
        controller: 'PanelsController',
        controllerAs: 'vm',
        resolve: {
          panelResolve: newPanel
        },
        data: {
          roles: ['organism', 'operator'],
          pageTitle: 'Panels Create'
        }
      })
      .state('panels.edit', {
        url: '/:panelId/edit',
        templateUrl: '/modules/panels/client/views/form-panel.client.view.html',
        controller: 'PanelsController',
        controllerAs: 'vm',
        resolve: {
          panelResolve: getPanel
        },
        data: {
          roles: ['organism'],
          pageTitle: 'Edit Panel {{ panelResolve.name }}'
        }
      })
      .state('panels.view', {
        url: '/:panelId',
        templateUrl: '/modules/panels/client/views/view-panel.client.view.html',
        controller: 'PanelsController',
        controllerAs: 'vm',
        resolve: {
          panelResolve: getPanel
        },
        data: {
          pageTitle: 'Panel {{ panelResolve.name }}'
        }
      });
  }

  getPanel.$inject = ['$stateParams', 'PanelsService'];

  function getPanel($stateParams, PanelsService) {
    return PanelsService.get({
      panelId: $stateParams.panelId
    }).$promise;
  }

  newPanel.$inject = ['PanelsService'];

  function newPanel(PanelsService) {
    return new PanelsService();
  }
}());
