(function () {
  'use strict';

  // Alarms controller
  angular
    .module('alarms')
    .controller('AlarmsController', AlarmsController);

  AlarmsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'alarmResolve', 'UsersService', 'CategoriaserviciosService', 'NetworksService', 'LogsServicePOST'];

  function AlarmsController ($scope, $state, $window, Authentication, alarm, UsersService, CategoriaserviciosService, NetworksService, LogsServicePOST) {
    var vm = this;

    vm.authentication = Authentication;
    vm.alarm = alarm;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    var operator;

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
          operator = data.filter(function (data) {
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

    var deletedAlarm = false;
    // Remove existing Alarm
    function remove() {
      if ($window.confirm('Esta acción eliminará de manera definitiva la alarma')) {
        // vm.alarm.$remove($state.go('alarms.list'));
        deletedAlarm = true;
        save(true);
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
        vm.alarm.icon = '/modules/panels/client/img/wait.png';
      } else {
        // con asignacion
        vm.alarm.status = 'en atencion';
        vm.alarm.icon = '/modules/panels/client/img/process.png';
        // aca registro en la unidad el status "ocupado"
        /*
        ruta para el get y put: /api/networks/:networkId
        id del network: vm.alarm.network
        * */
        // se hace registra en el log
        logServicePOST('Se ha asignado una unidad exitosamente', vm.alarm._id, operator[0]._id);
      }

      if (deletedAlarm === true) {
        vm.alarm.status = 'rechazado';
        vm.alarm.icon = '/modules/panels/client/img/deleted.png';
        // se hace registra en el log
        logServicePOST('La solicitud de atención ha sido rechazada', vm.alarm._id, operator[0]._id);

      }

      // TODO: move create/update logic to service
      if (vm.alarm._id) {
        vm.alarm.$update(successCallback, errorCallback);
      } else {
        vm.alarm.$save(successCallback, errorCallback);
      }

      function logServicePOST(_description, _alarm, _user) {

        LogsServicePOST.charge({ description: _description, alarm: _alarm, user:  _user}, function (data) {
          // se realizo el post
        });
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
