(function () {
  'use strict';

  // Adminlogs controller
  angular
    .module('adminlogs')
    .controller('AdminlogsController', AdminlogsController);

  AdminlogsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'adminlogResolve'];

  function AdminlogsController ($scope, $state, $window, Authentication, adminlog) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adminlog = adminlog;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Adminlog
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.adminlog.$remove($state.go('adminlogs.list'));
      }
    }

    // Save Adminlog
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adminlogForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.adminlog._id) {
        vm.adminlog.$update(successCallback, errorCallback);
      } else {
        vm.adminlog.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('adminlogs.view', {
          adminlogId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
