// Alarms service used to communicate Alarms REST endpoints
(function () {
  'use strict';

  angular
    .module('alarms')
    .factory('AlarmsService', AlarmsService);

  AlarmsService.$inject = ['$resource'];

  function AlarmsService($resource) {
    return $resource('/api/alarms/:alarmId', {
      alarmId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
