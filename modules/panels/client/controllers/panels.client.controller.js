(function () {
  'use strict';

  // Panels controller
  angular
    .module('panels')
    .controller('PanelsController', PanelsController);

  PanelsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'panelResolve', 'NgMap'];

  function PanelsController ($scope, $state, $window, Authentication, panel, ngMap) {
    var vm = this;

    vm.authentication = Authentication;
    vm.panel = panel;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    function onClickMarker() {
      console.log('Click');
    }

    // Remove existing Panel
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.panel.$remove($state.go('panels.list'));
      }
    }

    // Save Panel
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.panelForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.panel._id) {
        vm.panel.$update(successCallback, errorCallback);
      } else {
        vm.panel.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('panels.view', {
          panelId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
