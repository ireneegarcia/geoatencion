(function () {
  'use strict';

  // Estadisticas controller
  angular
    .module('estadisticas')
    .controller('EstadisticasController', EstadisticasController);

  EstadisticasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'estadisticaResolve', 'AlarmsService', 'UsersService', 'SolicitudsService', 'LogsService'];

  function EstadisticasController ($scope, $state, $window, Authentication, estadistica, AlarmsService, UsersService, SolicitudsService, LogsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.estadistica = estadistica;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.alarms = [];
    vm.log = [];
    var operator;


    // Condicional para encontrar el organismo relacionado
    if (Authentication.user.roles[0] === 'organism') {
      UsersService.query(function (data) {
        // El organismo logueado
        vm.organism = data.filter(function (data) {
          return (data.email.indexOf(Authentication.user.email) >= 0);
        });
        getMyAlarms(vm.organism[0]._id);
      });
    } else {
      if (Authentication.user.roles[0] === 'operator') {
        UsersService.query(function (data) {
          // El operador logueado
          operator = data.filter(function (data) {
            return (data.email.indexOf(Authentication.user.email) >= 0);
          });
          // El organismo al que pertence el operador logueado
          vm.organism = data.filter(function (data) {
            return (data._id.indexOf(operator[0].user._id) >= 0);
          });
          getMyAlarms(vm.organism[0]._id);
        });
      }
    }

    function getMyAlarms(organism) {

      /*
       Todas las alarmas con excepcion de las que ya fueron atendidas
       Se valida que: exista afiliación del usuario con el organismo (solicitud aceptada)
       se valida que la categoría de la solicitud sea la categoría de atención del organismo
       * */
      AlarmsService.query(function (data) {
        data.forEach(function(alarm) {
          SolicitudsService.query(function (data) {
            data.forEach(function(solicitud) {
              if (solicitud.organism === organism && solicitud.status === 'aceptado' &&
                solicitud.user._id === alarm.user._id && solicitud.category === alarm.categoryService) {
                vm.alarms.push(alarm);
              }
            });
          });
        });
      });
    }

    // Log por usuario
    vm.searchUserLog = function (userId) {
      // Usuario

      LogsService.query(function (data) {
        vm.logClient = data.filter(function (data) {
          return (data.client.indexOf(userId) >= 0);
        });
      });
    };

    // Remove existing Estadistica
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.estadistica.$remove($state.go('estadisticas.list'));
      }
    }

    // Save Estadistica
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.estadisticaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.estadistica._id) {
        vm.estadistica.$update(successCallback, errorCallback);
      } else {
        vm.estadistica.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('estadisticas.view', {
          estadisticaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
