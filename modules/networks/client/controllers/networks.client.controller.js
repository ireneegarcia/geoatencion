(function () {
  'use strict';

  // Networks controller
  angular
    .module('networks')
    .controller('NetworksController', NetworksController);

  NetworksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'networkResolve', 'CategoriaserviciosService', 'UsersService', '$filter'];

  function NetworksController ($scope, $state, $window, Authentication, network, CategoriaserviciosService, UsersService, $filter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.network = network;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    CategoriaserviciosService.query({}).$promise.then(function (res) {
      vm.categories = [];
      res.forEach(function(cathegory) {
        vm.categories.push({id: cathegory._id, name: cathegory.category});
      });
    });

    // Listado de usuarios responsables de unidades
    var serviceUsers = [];
    UsersService.query(function (data) {
      // Responsables de unidades
      vm.serviceUsers = data.filter(function (data) {
        return (data.roles.indexOf('serviceUser') >= 0);
      });
    });

    // Listar las unidades dependiendo del organismo

    // console.log(vm.network.serviceUser);

    if (vm.network.serviceUser) {

      UsersService.query(function (data) {
        // Responsables de unidades
        serviceUsers = data.forEach(function (data) {
          if (data.roles.indexOf('serviceUser') >= 0 &&
            data._id.indexOf(vm.network.serviceUser) >= 0) {
            network.serviceUserEmail = data.email;
          }
        });
        vm.network.push(network);
      });
    }

    // Remove existing Network
    function remove() {
      if ($window.confirm('¿Esta seguro de querer borrar esta unidad de manera definitiva?')) {
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
