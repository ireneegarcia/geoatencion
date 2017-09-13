// Logs service used to communicate Logs REST endpoints
(function () {
  'use strict';

  angular
    .module('logs')
    .factory('LogsServicePOST', LogsService);

  LogsService.$inject = ['$resource'];

  function LogsService($resource) {
    return $resource('/api/logs', {
      description: '@description',
      alarm: '@alarm',
      user: '@_id'
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