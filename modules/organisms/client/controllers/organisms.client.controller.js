(function () {
  'use strict';

  // Organisms controller
  angular
    .module('organisms')
    .controller('OrganismsController', OrganismsController);

  OrganismsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'organismResolve', 'CategoriaserviciosService'];

  function OrganismsController ($scope, $state, $window, Authentication, organism, CategoriaserviciosService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.organism = organism;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.categories = CategoriaserviciosService.query();

    // Remove existing Organism
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.organism.$remove($state.go('organisms.list'));
      }
    }

    // Save Organism
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.organismForm');
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.organism._id) {
        vm.organism.$update(successCallback, errorCallback);
        $state.go('organisms.list', {
          // organismId: res._id
        });
      } else {
        vm.organism.$save(successCallback, errorCallback);
        $state.go('authentication.signup-admin-organism', {
          // organismId: res._id
        });
      }

      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
