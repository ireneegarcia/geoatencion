(function () {
  'use strict';

  // Alarmas controller
  angular
    .module('alarmas')
    .controller('AlarmasController', AlarmasController);

  AlarmasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'alarmaResolve'];

  function AlarmasController ($scope, $state, $window, Authentication, alarma) {
    var vm = this;

    vm.authentication = Authentication;
    vm.alarma = alarma;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Alarma
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.alarma.$remove($state.go('alarmas.list'));
      }
    }

    // Save Alarma
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.alarmaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.alarma._id) {
        vm.alarma.$update(successCallback, errorCallback);
      } else {
        vm.alarma.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('alarmas.view', {
          alarmaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
