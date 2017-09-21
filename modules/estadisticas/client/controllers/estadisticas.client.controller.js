(function () {
  'use strict';

  // Estadisticas controller
  angular
    .module('estadisticas')
    .controller('EstadisticasController', EstadisticasController);

  EstadisticasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'estadisticaResolve', 'AlarmsService'];

  function EstadisticasController ($scope, $state, $window, Authentication, estadistica, AlarmsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.estadistica = estadistica;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    // Todas las alarmas por status
    AlarmsService.query(function (data) {
      // Todas las alarmas
      vm.alarms = AlarmsService.query();

      // Alarmas con status esperando o en atencion
      vm.alarmsEsperando = data.filter(function (data) {
        return (data.status.indexOf('esperando') >= 0);
      });
      //  Alarmas en atención
      vm.alarmsEnAtencion = data.filter(function (data) {
        return (data.status.indexOf('en atencion') >= 0);
      });
      //  Alarmas rechazadas
      vm.alarmsRechazado = data.filter(function (data) {
        return (data.status.indexOf('rechazado') >= 0);
      });
    });

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
