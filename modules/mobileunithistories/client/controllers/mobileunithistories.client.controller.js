(function () {
  'use strict';

  // Mobileunithistories controller
  angular
    .module('mobileunithistories')
    .controller('MobileunithistoriesController', MobileunithistoriesController);

  MobileunithistoriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'mobileunithistoryResolve'];

  function MobileunithistoriesController ($scope, $state, $window, Authentication, mobileunithistory) {
    var vm = this;

    vm.authentication = Authentication;
    vm.mobileunithistory = mobileunithistory;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Mobileunithistory
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.mobileunithistory.$remove($state.go('mobileunithistories.list'));
      }
    }

    // Save Mobileunithistory
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mobileunithistoryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.mobileunithistory._id) {
        vm.mobileunithistory.$update(successCallback, errorCallback);
      } else {
        vm.mobileunithistory.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('mobileunithistories.view', {
          mobileunithistoryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
