(function () {
  'use strict';

  // Formularios controller
  angular
    .module('formularios')
    .controller('FormulariosController', FormulariosController);

  FormulariosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'formularioResolve'];

  function FormulariosController ($scope, $state, $window, Authentication, formulario) {
    var vm = this;

    vm.authentication = Authentication;
    vm.formulario = formulario;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Formulario
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.formulario.$remove($state.go('formularios.list'));
      }
    }

    // Save Formulario
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.formularioForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.formulario._id) {
        vm.formulario.$update(successCallback, errorCallback);
      } else {
        vm.formulario.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('formularios.view', {
          formularioId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
