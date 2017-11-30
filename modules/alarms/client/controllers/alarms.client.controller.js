(function () {
  'use strict';

  // Alarms controller
  angular
    .module('alarms')
    .controller('AlarmsController', AlarmsController);

  AlarmsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'alarmResolve', 'UsersService', 'CategoriaserviciosService', 'NetworksService', 'LogsServiceCreate', 'LogsService', 'FirebasetokensService', 'AlarmsService', 'MobileunitlogsServiceCreate'];

  function AlarmsController ($scope, $state, $window, Authentication, alarm, UsersService, CategoriaserviciosService, NetworksService, LogsServiceCreate, LogsService, FirebasetokensService, AlarmsService, MobileunitlogsServiceCreate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.alarm = alarm;
    vm.error = null;
    vm.form = {};
    vm.wait = vm.alarm.created;
    vm.remove = remove;
    vm.save = save;
    var operator;
    vm.networks = [];
    vm.log = [];

    UsersService.query(function (data) {
      // Datos del usuario
      vm.user = data.filter(function (data) {
        return (data._id.indexOf(alarm.user._id) >= 0);
      });
    });

    CategoriaserviciosService.query(function (data) {
      // Categoria
      vm.category = data.filter(function (data) {
        return (data._id.indexOf(vm.alarm.categoryService) >= 0);
      });
    });


    LogsService.query(function (data) {
      data.forEach(function(data) {
        if (data.alarm !== '') {
          if (data.alarm === vm.alarm._id) {
            vm.log.push(data);
          }
        }
      });
      console.log(vm.log);
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
      // Si la alarma est aen espera
      if (vm.alarm.status === 'esperando') {
        NetworksService.query(function (data) {
          data.forEach(function(network) {
            if (network.user._id === organism[0]._id && network.status === 'activo') {
              UsersService.query(function (data) {
                data.forEach(function (user) {
                  if (user.roles.indexOf('serviceUser') >= 0 &&
                    user._id.indexOf(network.serviceUser) >= 0) {
                    network.serviceUserEmail = user.email;
                  }
                });
              });
              vm.networks.push(network);
            }
          });
        });
      }

      // Si la alarma ya tiene asignación
      if (vm.alarm.status === 'en atencion') {
        NetworksService.query(function (data) {
          // Network asignado
          vm.networks = data.filter(function (data) {
            return (data._id.indexOf(vm.alarm.network) >= 0);
          });
          vm.getDirections();
        });
      }

    }

    // instantiate google map objects for directions
    var directionsDisplay = new window.google.maps.DirectionsRenderer();
    var directionsService = new window.google.maps.DirectionsService();
    vm.getDirections = function () {

      var request = {
        origin: vm.alarm.latitude + ',' + vm.alarm.longitude,
        destination: vm.networks[0].latitude + ',' + vm.networks[0].longitude,
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

    function logServicePOST(description) {
      if (vm.alarm.network === '') {
        LogsServiceCreate.charge({
          description: description,
          alarm: vm.alarm._id,
          client: vm.alarm.user._id,
          organism: vm.organism[0]._id}, function (data) {
          // se realizo el post
        });
      } else {
        LogsServiceCreate.charge({
          description: description,
          alarm: vm.alarm._id,
          network: vm.alarm.network,
          client: vm.alarm.user._id,
          organism: vm.organism[0]._id}, function (data) {
          // se realizo el post
        });
      }

    }

    function networkServicePUT(status, id) {
      // GET
      var network = NetworksService.get({ networkId: id});
      network.status = status;
      // PUT
      NetworksService.update({ networkId: id}, network);
    }


    function remove(option) {
      var logText = '';
      // Rechazar
      if (option === 1) {
        if ($window.confirm('¿Esta seguro que desea rechazar la solicitud?')) {
          // vm.alarm.$remove($state.go('alarms.list'));
          // Se cambia status
          alarm.status = 'rechazado';
          alarm.icon = '/modules/panels/client/img/deleted.png';
          logText = 'Ha sido rechazada la solicitud de atención: ' + alarm._id +
            ' del cliente: ' + vm.user[0].displayName +
            ', por el operador: ' + operator[0].displayName;
        }
      }

      // Cancelar
      if (option === 2) {
        if ($window.confirm('¿Esta seguro que desea cancelar la atención?')) {
          // Se cambia status
          alarm.status = 'cancelado por el operador';
          alarm.icon = '/modules/panels/client/img/canceled.png';

          logText = 'Ha sido cancelada la solicitud de atención: ' + alarm._id +
            ' del cliente: ' + vm.user[0].displayName +
            ', por el operador: ' + operator[0].displayName;

          // Se libera a la unidad de atención
          NetworksService.query(function (data) {
            vm.cancel_network = data.filter(function (data) {
              return (data._id.indexOf(alarm.network) >= 0);
            });

            alarm.network = '';
            // Se cambia el status de la unidad
            networkServicePUT('activo', vm.cancel_network[0]._id);
          });
        }
      }

      var firebasetoken;
      var firebasetokenNetwork;
      // Se busca el token del usuario
      FirebasetokensService.query(function (data) {

        firebasetoken = data.filter(function (data) {
          return (data.userId.indexOf(vm.alarm.user._id) >= 0);
        });

        /* firebasetokenNetwork = data.filter(function (data) {
         return (option === 2 && (data.userId.indexOf(vm.cancel_network[0].serviceUser) >= 0));
         });
         */
        /* alarm.firebasetokenNetwork = firebasetokenNetwork[0].token;*/
        alarm.firebasetoken = firebasetoken[0].token;

        // Se actualiza la alarma (PUT)
        AlarmsService.update({alarmId: alarm._id}, alarm);

        // Se registra en el log
        logServicePOST(logText);

      });
    }

// Save Alarm
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.alarmForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.alarm._id && vm.alarm.network !== '') {

        var firebasetoken;
        var networkSelected;
        var firebasetokenNetwork;

        // Se busca el token del usuario
        FirebasetokensService.query(function (firebase) {

          // se busca el network asignado
          NetworksService.query(function (data) {
            networkSelected = data.filter(function (data) {
              return (data._id.indexOf(vm.alarm.network) >= 0);
            });

            firebasetoken = firebase.filter(function (data) {
              return (data.userId.indexOf(vm.alarm.user._id) >= 0);
            });

            firebasetokenNetwork = firebase.filter(function (data) {
              return (data.userId.indexOf(networkSelected[0].serviceUser) >= 0);
            });

            // con asignacion
            vm.alarm.status = 'en atencion';
            vm.alarm.icon = '/modules/panels/client/img/process.png';

            // Se incluye la ubicacion de la unidad
            vm.alarm.networkLatitude = networkSelected[0].latitude;
            vm.alarm.networkLongitude = networkSelected[0].longitude;

            // codigo de la unidad
            vm.alarm.carCode = networkSelected[0].carCode;
            // address de la unidad
            vm.alarm.networkAddress = networkSelected[0].address;


            // Se incluye el token de firebase
            vm.alarm.firebasetoken = firebasetoken[0].token;
            vm.alarm.firebasetokenNetwork = firebasetokenNetwork[0].token;

            // aca registro en la unidad el status "ocupado"
            networkServicePUT('ocupado', vm.alarm.network);

            // se hace registra en el log
            logServicePOST('Se ha asignado exitosamente la unidad: ' + networkSelected[0].carCode +
              ' a la solicitud de atención: ' + vm.alarm._id +
              ' del cliente: ' + vm.user[0].displayName);

            MobileunitlogsServiceCreate.charge({
              mobileUnit: networkSelected[0]._id,
              mobileUnitCarCode: networkSelected[0].carCode,
              description: 'Se le fue asignado el evento: ' + vm.alarm._id}, function (data) {
              // se realizo el post
            });

            // Se actualiza (PUT)
            vm.alarm.$update(successCallback, errorCallback);
          });

        });

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
