(function () {
  'use strict';

  // Firebasetokens controller
  angular
    .module('firebasetokens')
    .controller('FirebasetokensController', FirebasetokensController);

  FirebasetokensController.$inject = ['$scope', '$state', '$window', 'Authentication', 'firebasetokenResolve'];

  function FirebasetokensController ($scope, $state, $window, Authentication, firebasetoken) {
    var vm = this;

    vm.authentication = Authentication;
    vm.firebasetoken = firebasetoken;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Firebasetoken
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.firebasetoken.$remove($state.go('firebasetokens.list'));
      }
    }

    // Save Firebasetoken
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.firebasetokenForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.firebasetoken._id) {
        vm.firebasetoken.$update(successCallback, errorCallback);
      } else {
        vm.firebasetoken.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('firebasetokens.view', {
          firebasetokenId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
