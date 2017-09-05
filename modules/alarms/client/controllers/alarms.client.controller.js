(function () {
  'use strict';

  // Alarms controller
  angular
    .module('alarms')
    .controller('AlarmsController', AlarmsController);

  AlarmsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'alarmResolve', 'UsersService', 'CategoriaserviciosService', 'NetworksService'];

  function AlarmsController ($scope, $state, $window, Authentication, alarm, UsersService, CategoriaserviciosService, NetworksService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.alarm = alarm;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.networks = [];
    var networks = NetworksService.query({}).$promise.then(function (data) {
      networks = data;
    });

    UsersService.query(function (data) {
      // Datos del usuario
      vm.user = data.filter(function (data) {
        return (data._id.indexOf(vm.alarm.user._id) >= 0);
      });
    });

    CategoriaserviciosService.query(function (data) {
      // Categoria
      vm.category = data.filter(function (data) {
        return (data._id.indexOf(vm.alarm.categoryService) >= 0);
      });
    });

    // Condicional para encontrar el organismo relacionado
    if (Authentication.user.roles[0] === 'organism') {
      UsersService.query(function (data) {
        // El organismo logueado
        vm.organism = data.filter(function (data) {
          return (data.email.indexOf(Authentication.user.email) >= 0);
        });
        listNetwork(vm.organism);
      });
    } else {
      if (Authentication.user.roles[0] === 'operator') {
        UsersService.query(function (data) {
          // El operador logueado
          var operator = data.filter(function (data) {
            return (data.email.indexOf(Authentication.user.email) >= 0);
          });
          // El organismo al que pertence el operador logueado
          vm.organism = data.filter(function (data) {
            return (data._id.indexOf(operator[0].user._id) >= 0);
          });
          listNetwork(vm.organism);
        });
      }
    }

    // Listado de usuarios responsables de unidades
    var serviceUsers = [];
    UsersService.query(function (data) {
      // Responsables de unidades
      serviceUsers = data.filter(function (data) {
        return (data.roles.indexOf('serviceUser') >= 0);
      });
    });

    // Funcion para listar las unidades dependiendo del organismo
    function listNetwork(organism) {
      NetworksService.query(function (data) {
        data.forEach(function(network) {
          if (network.user._id === organism[0]._id) {
            UsersService.query(function (data) {
              data.forEach(function (user) {
                if (user.roles.indexOf('serviceUser') >= 0 &&
                  user._id.indexOf(network.serviceUser) >= 0) {
                  network.serviceUserEmail = user.email;
                }
              });
            });
            vm.networks.push(network);
           // console.log(vm.networks);
          }
        });
      });
    }

    // Remove existing Alarm
    function remove() {
      if ($window.confirm('Esta acción eliminará de manera definitiva la alarma')) {
        vm.alarm.$remove($state.go('alarms.list'));
      }
    }

    // Save Alarm
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.alarmForm');
        return false;
      }

      if (vm.alarm.network === '') {
        // vacio
        vm.alarm.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
      } else {
        // con asignacion
        vm.alarm.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      }

      // TODO: move create/update logic to service
      if (vm.alarm._id) {
        vm.alarm.$update(successCallback, errorCallback);
      } else {
        vm.alarm.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('alarms.view', {
          alarmId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
