(function () {
  'use strict';

  // Solicituds controller
  angular
    .module('solicituds')
    .controller('SolicitudsController', SolicitudsController);

  SolicitudsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'solicitudResolve'];

  function SolicitudsController ($scope, $state, $window, Authentication, solicitud) {
    var vm = this;

    vm.authentication = Authentication;
    vm.solicitud = solicitud;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Solicitud
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.solicitud.$remove($state.go('solicituds.list'));
      }
    }

    // Save Solicitud
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.solicitudForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.solicitud._id) {
        vm.solicitud.$update(successCallback, errorCallback);
      } else {
        vm.solicitud.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('solicituds.view', {
          solicitudId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
