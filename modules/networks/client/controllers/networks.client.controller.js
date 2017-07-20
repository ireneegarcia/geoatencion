(function () {
  'use strict';

  // Networks controller
  angular
    .module('networks')
    .controller('NetworksController', NetworksController);

  NetworksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'networkResolve'];

  function NetworksController ($scope, $state, $window, Authentication, network) {
    var vm = this;

    vm.authentication = Authentication;
    vm.network = network;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Network
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.network.$remove($state.go('networks.list'));
      }
    }

    // Save Network
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.networkForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.network._id) {
        vm.network.$update(successCallback, errorCallback);
      } else {
        vm.network.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('networks.view', {
          networkId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
