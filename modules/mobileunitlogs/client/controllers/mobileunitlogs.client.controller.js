(function () {
  'use strict';

  // Mobileunitlogs controller
  angular
    .module('mobileunitlogs')
    .controller('MobileunitlogsController', MobileunitlogsController);

  MobileunitlogsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'mobileunitlogResolve'];

  function MobileunitlogsController ($scope, $state, $window, Authentication, mobileunitlog) {
    var vm = this;

    vm.authentication = Authentication;
    vm.mobileunitlog = mobileunitlog;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Mobileunitlog
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.mobileunitlog.$remove($state.go('mobileunitlogs.list'));
      }
    }

    // Save Mobileunitlog
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mobileunitlogForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.mobileunitlog._id) {
        vm.mobileunitlog.$update(successCallback, errorCallback);
      } else {
        vm.mobileunitlog.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('mobileunitlogs.view', {
          mobileunitlogId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
