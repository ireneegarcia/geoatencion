(function () {
  'use strict';

  angular
    .module('alarms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('alarms', {
        abstract: true,
        url: '/alarms',
        template: '<ui-view/>'
      })
      .state('alarms.list', {
        url: '',
        templateUrl: '/modules/alarms/client/views/list-alarms.client.view.html',
        controller: 'AlarmsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Alarms List'
        }
      }).state('alarms.rating', {
        url: '/rating',
        templateUrl: '/modules/alarms/client/views/alarms-rating.client.view.html',
        controller: 'AlarmsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Alarms List'
        }
      })
      .state('alarms.create', {
        url: '/create',
        templateUrl: '/modules/alarms/client/views/form-alarm.client.view.html',
        controller: 'AlarmsController',
        controllerAs: 'vm',
        resolve: {
          alarmResolve: newAlarm
        },
        data: {
          roles: ['user', 'admin', 'organism', 'operator', 'adminOrganism'],
          pageTitle: 'Alarms Create'
        }
      })
      .state('alarms.edit', {
        url: '/:alarmId/edit',
        templateUrl: '/modules/alarms/client/views/form-alarm.client.view.html',
        controller: 'AlarmsController',
        controllerAs: 'vm',
        resolve: {
          alarmResolve: getAlarm
        },
        data: {
          roles: ['user', 'admin', 'organism', 'operator', 'guest', 'adminOrganism'],
          pageTitle: 'Edit Alarm {{ alarmResolve.name }}'
        }
      })
      .state('alarms.view', {
        url: '/:alarmId',
        templateUrl: '/modules/alarms/client/views/view-alarm.client.view.html',
        controller: 'AlarmsController',
        controllerAs: 'vm',
        resolve: {
          alarmResolve: getAlarm
        },
        data: {
          pageTitle: 'Alarm {{ alarmResolve.name }}'
        }
      });
  }

  getAlarm.$inject = ['$stateParams', 'AlarmsService'];

  function getAlarm($stateParams, AlarmsService) {
    return AlarmsService.get({
      alarmId: $stateParams.alarmId
    }).$promise;
  }

  newAlarm.$inject = ['AlarmsService'];

  function newAlarm(AlarmsService) {
    return new AlarmsService();
  }
}());
