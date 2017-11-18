(function () {
  'use strict';

  angular
    .module('adminlogs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('adminlogs', {
        abstract: true,
        url: '/adminlogs',
        template: '<ui-view/>'
      })
      .state('adminlogs.list', {
        url: '',
        templateUrl: '/modules/adminlogs/client/views/list-adminlogs.client.view.html',
        controller: 'AdminlogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Adminlogs List'
        }
      })
      .state('adminlogs.create', {
        url: '/create',
        templateUrl: '/modules/adminlogs/client/views/form-adminlog.client.view.html',
        controller: 'AdminlogsController',
        controllerAs: 'vm',
        resolve: {
          adminlogResolve: newAdminlog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Adminlogs Create'
        }
      })
      .state('adminlogs.edit', {
        url: '/:adminlogId/edit',
        templateUrl: '/modules/adminlogs/client/views/form-adminlog.client.view.html',
        controller: 'AdminlogsController',
        controllerAs: 'vm',
        resolve: {
          adminlogResolve: getAdminlog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Adminlog {{ adminlogResolve.name }}'
        }
      })
      .state('adminlogs.view', {
        url: '/:adminlogId',
        templateUrl: '/modules/adminlogs/client/views/view-adminlog.client.view.html',
        controller: 'AdminlogsController',
        controllerAs: 'vm',
        resolve: {
          adminlogResolve: getAdminlog
        },
        data: {
          pageTitle: 'Adminlog {{ adminlogResolve.name }}'
        }
      });
  }

  getAdminlog.$inject = ['$stateParams', 'AdminlogsService'];

  function getAdminlog($stateParams, AdminlogsService) {
    return AdminlogsService.get({
      adminlogId: $stateParams.adminlogId
    }).$promise;
  }

  newAdminlog.$inject = ['AdminlogsService'];

  function newAdminlog(AdminlogsService) {
    return new AdminlogsService();
  }
}());
