(function () {
  'use strict';

  // Organisms controller
  angular
    .module('organisms')
    .controller('OrganismsController', OrganismsController);

  OrganismsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'organismResolve'];

  function OrganismsController ($scope, $state, $window, Authentication, organism) {
    var vm = this;

    vm.authentication = Authentication;
    vm.organism = organism;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Organism
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.organism.$remove($state.go('organisms.list'));
      }
    }

    // Save Organism
    function save(isValid) {
      console.log(isValid);
      console.log(vm.organism);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.organismForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.organism._id) {
        vm.organism.$update(successCallback, errorCallback);
      } else {
        vm.organism.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('authentication.signup-admin-organism', {
          organismId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
