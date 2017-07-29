(function () {
  'use strict';

  // Formularios controller
  angular
    .module('formularios')
    .controller('FormulariosController', FormulariosController);

  FormulariosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'formularioResolve', 'CategoriaserviciosService'];

  function FormulariosController ($scope, $state, $window, Authentication, formulario, CategoriaserviciosService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.formulario = formulario;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.categories = [
      {id: 1, name: 'Asistencia bomberil'},
      {id: 2, name: 'Asistencia de seguridad'},
      {id: 3, name: 'Asistencia médica'},
      {id: 4, name: 'Todas las anteriores'},
      {id: 5, name: 'Otra categoría'},
      {id: 6, name: 'Diversas categorías'},
    ];

    CategoriaserviciosService.query({}).$promise.then(function (res) {
      vm.categories = [];
      res.forEach(function(cathegory) {
        vm.categories.push({id: cathegory._id, name: cathegory.category});
      });
    });

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
