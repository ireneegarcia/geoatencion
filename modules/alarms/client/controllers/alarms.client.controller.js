(function () {
  'use strict';

  // Alarms controller
  angular
    .module('alarms')
    .controller('AlarmsController', AlarmsController);

  AlarmsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'alarmResolve', 'UsersService', 'CategoriaserviciosService'];

  function AlarmsController ($scope, $state, $window, Authentication, alarm, UsersService, CategoriaserviciosService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.alarm = alarm;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    UsersService.query(function (data) {
      // Datos del usuario
      vm.user = data.filter(function (data) {
        return (data._id.indexOf(vm.alarm.user._id) >= 0);
      });
    });

    CategoriaserviciosService.query(function (data) {
      // Categoria
      vm.category = data.filter(function (data) {
        return (data._id.indexOf(vm.alarm.categoryService) >= 0);
      });
      console.log(vm.category);
    });

    // Remove existing Alarm
    function remove() {
      if ($window.confirm('Esta acción eliminará de manera definitiva la alarma')) {
        vm.alarm.$remove($state.go('alarms.list'));
      }
    }

    // Save Alarm
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.alarmForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.alarm._id) {
        vm.alarm.$update(successCallback, errorCallback);
      } else {
        vm.alarm.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('alarms.view', {
          alarmId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
