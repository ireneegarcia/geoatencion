(function () {
  'use strict';

  // Catalogos controller
  angular
    .module('catalogos')
    .controller('CatalogosController', CatalogosController);

  CatalogosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'catalogoResolve'];

  function CatalogosController ($scope, $state, $window, Authentication, catalogo) {
    var vm = this;

    vm.authentication = Authentication;
    vm.catalogo = catalogo;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Catalogo
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.catalogo.$remove($state.go('catalogos.list'));
      }
    }

    // Save Catalogo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.catalogoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.catalogo._id) {
        vm.catalogo.$update(successCallback, errorCallback);
      } else {
        vm.catalogo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('catalogos.view', {
          catalogoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
