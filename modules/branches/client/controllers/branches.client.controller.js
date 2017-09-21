(function () {
  'use strict';

  // Branches controller
  angular
    .module('branches')
    .controller('BranchesController', BranchesController);

  BranchesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'branchResolve'];

  function BranchesController ($scope, $state, $window, Authentication, branch) {
    var vm = this;

    vm.authentication = Authentication;
    vm.branch = branch;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Branch
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.branch.$remove($state.go('branches.list'));
      }
    }

    // Save Branch
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.branchForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.branch._id) {
        vm.branch.$update(successCallback, errorCallback);
      } else {
        vm.branch.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('branches.view', {
          branchId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
