// Logs service used to communicate Logs REST endpoints
(function () {
  'use strict';

  angular
    .module('logs')
    .factory('LogsService', LogsService)
    .factory('LogsServiceCreate', LogsServiceCreate);

  LogsService.$inject = ['$resource'];

  function LogsService($resource) {
    return $resource('/api/logs/:logId', {
      logId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  LogsServiceCreate.$inject = ['$resource'];

  function LogsServiceCreate($resource) {
    return $resource('/api/logs', {
      description: '@description',
      alarm: '@_alarm',
      network: '@_network',
      client: '@_client',
      organism: '@_organism'
    }, {
      charge: {
        method: 'POST'
      }
    });
  }
}());


/*
// Logs service used to communicate Logs REST endpoints
(function () {
  'use strict';

  angular
    .module('logs')
    .factory('LogsService', LogsService);

  LogsService.$inject = ['$resource'];

  function LogsService($resource) {
    return $resource('/api/logs/:logId', {
      logId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

}());
*/
