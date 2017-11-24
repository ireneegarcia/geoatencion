(function () {
  'use strict';

  // Networks controller
  angular
    .module('networks')
    .controller('NetworksController', NetworksController);

  NetworksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'networkResolve', 'CategoriaserviciosService', 'UsersService', '$filter', 'AlarmsService', 'NetworksService', 'AdminlogsServiceCreate', 'OrganismsService', 'Notification'];

  function NetworksController ($scope, $state, $window, Authentication, network, CategoriaserviciosService, UsersService, $filter, AlarmsService, NetworksService, AdminlogsServiceCreate, OrganismsService, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.network = network;
    vm.serviceUsers = [];
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
    UsersService.query(function (data) {
      data.forEach(function(user) {
        var isBusy = false;
        // que sea roles serviceUser
        if (user.roles.indexOf('serviceUser') >= 0) {
          // se evalua si la unidad ya tiene usuario asignado
          vm.serviceUsers.push(user);
          NetworksService.query(function (data) {
            data.forEach(function (network) {
              // que no este asignado a otra unidad
              if (network.organism === vm.authentication.user.organism) {
                if (network.serviceUser === user._id) {
                  vm.serviceUsers.splice(vm.serviceUsers.length - 1, 1);
                }
              }
            });
          });

          if (vm.network.serviceUser === user._id) {
            vm.serviceUsers.push(user);
          }
        }
      });
    });

    // Listar las unidades dependiendo del organismo
    if (vm.network.serviceUser) {
      var serviceUsers = [];
      UsersService.query(function (data) {
        // Responsables de unidades
        serviceUsers = data.forEach(function (data) {
          if (data.roles.indexOf('serviceUser') >= 0 &&
            data._id.indexOf(vm.network.serviceUser) >= 0) {
            network.serviceUserEmail = data.email;
          }
        });
        vm.network.serviceUserEmail = network.serviceUserEmail;
      });
    }

    // Encontrar alarma a la que esta relacionado el network
    if (vm.network.status === 'ocupado') {
      // Todas las alarmas por status
      AlarmsService.query(function (data) {
        vm.alarm = data.filter(function (data) {
          return (data.network.indexOf(vm.network._id) >= 0);
        });
        vm.getDirections();
      });
    }

    // instantiate google map objects for directions
    var directionsDisplay = new window.google.maps.DirectionsRenderer();
    var directionsService = new window.google.maps.DirectionsService();
    vm.getDirections = function () {

      var request = {
        origin: vm.alarm[0].latitude + ',' + vm.alarm[0].longitude,
        destination: vm.network.latitude + ',' + vm.network.longitude,
        travelMode: window.google.maps.DirectionsTravelMode.DRIVING
      };

      directionsService.route(request, function (response, status) {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);

          // directionsDisplay.setMap($scope.map.control.getGMap());
          directionsDisplay.setPanel(document.getElementById('directionsList'));
          // vm.directions.showList = true;
        } else {
          // alert('Google route unsuccesfull!');
        }
      });
    };

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
        AdminlogsServiceCreate.charge({
          description: 'Ha actulizado los datos de la unidad: ' + vm.network.carCode,
          module: 'unidad de atención',
          organism: vm.authentication.user.organism}, function (data) {
          // se realizo el post
        });
      } else {

        if (vm.network.organism) {
          OrganismsService.query(function (data) {
            vm.organism = data.filter(function (data) {
              return (data.rif.indexOf(vm.network.organism) >= 0);
            });
            if (vm.organism.length !== 0) {
              AdminlogsServiceCreate.charge({
                description: 'Ha registrado la unidad: ' + vm.network.carCode,
                module: 'unidad de atención',
                organism: vm.authentication.user.organism}, function (data) {
                // se realizo el post
              });
              vm.network.$save(successCallback, errorCallback);
              Notification.success({ title: '<i class="glyphicon glyphicon-ok"></i> Registro exitoso!' });
            } else {
              Notification.error({ title: '<i class="glyphicon glyphicon-remove"></i> RIF inválido!', delay: 6000 });
            }
          });
        }
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
