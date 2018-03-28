(function () {
  'use strict';

  angular
    .module('panels')
    .controller('PanelsListController', PanelsListController);

  PanelsListController.$inject = ['PanelsService', 'AlarmsService', 'NgMap', 'NetworksService', 'CategoriaserviciosService', 'UsersService', 'Authentication', '$filter', '$timeout', 'SolicitudsService', 'Socket', '$window', 'LogsServiceCreate', 'FirebasetokensService', 'OrganismsService', 'MobileunitlogsServiceCreate'];

  function PanelsListController(PanelsService, AlarmsService, NgMap, NetworksService, CategoriaserviciosService, UsersService, Authentication, $filter, $timeout, SolicitudsService, Socket, $window, LogsServiceCreate, FirebasetokensService, OrganismsService, MobileunitlogsServiceCreate) {
    var vm = this;
    vm.user = Authentication.user;
    vm.panels = PanelsService.query();
    vm.networks = [];
    vm.directions = [];
    vm.alarms = [];
    vm.alarmsEsperando = [];
    vm.alarmsEnAtencion = [];
    vm.alarmsRechazado = [];
    vm.alarmsCanceled = [];
    vm.alarmsAtendido = [];
    vm.alarmsCanceladoCliente = [];
    vm.alarmsCanceladoOperator = [];
    vm.alarmsCanceladoUnidad = [];
    vm.centerLatitude = 8.2593534;
    vm.centerLongitude = -62.7734547;
    var operator;

    NgMap.getMap().then(function(map) {
      vm.map = map;
    });

    // Add an event listener to the 'alarmEvent' event
    Socket.on('alarmEvent', function (alarm) {
      vm.alarms.push(alarm);
      listAlarm((vm.organism[0]._id));
    });

    // Add an event listener to the 'networkPositionEvent' event
    Socket.on('networkPositionEvent', function (networkPosition) {
      var networkIdx = vm.networks.map(function(e) { return e._id; }).indexOf(networkPosition.id);
      if (networkIdx >= 0) {
        vm.networks[networkIdx].latitude = networkPosition.latitude;
        vm.networks[networkIdx].longitude = networkPosition.longitude;
      } else {
        NetworksService.get({networkId: networkPosition.id}, function (network) {
          vm.networks.push(network);
        });
      }
    });

    // Condicional para encontrar el organismo relacionado
    if (Authentication.user.roles[0] === 'adminOrganism') {
      OrganismsService.query(function (data) {
        // El organismo logueado
        vm.organism = data.filter(function (data) {
          return (data.rif.indexOf(Authentication.user.organism) >= 0);
        });
        listNetwork(vm.organism);
        listAlarm((vm.organism[0]._id));
      });

    } else {
      if (Authentication.user.roles[0] === 'operator') {
        UsersService.query(function (data) {
          // El operador logueado
          operator = data.filter(function (data) {
            return (data.email.indexOf(Authentication.user.email) >= 0);
          });
          // El organismo al que pertence el operador logueado
          OrganismsService.query(function (data) {
            // El organismo logueado
            vm.organism = data.filter(function (data) {
              return (data.rif.indexOf(operator[0].organism) >= 0);
            });
            listNetwork(vm.organism);
            listAlarm((vm.organism[0]._id));
          });
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
        // Alarmas con status esperando o en atencion
        vm.networks = data.filter(function (data) {
          return (data.organism.indexOf(organism[0].rif) >= 0 &&
          data.latitude !== '' && data.longitude !== '');
        });
      });
    }

    vm.listAlarmAll = function () {
      listAlarm((vm.organism[0]._id));
    };

    // Funcion para listar las alarmas
    function listAlarm(organism) {
      // Todas las alarmas

      AlarmsService.query(function (data) {

        vm.alarmsEsperando = [];
        vm.alarmsEnAtencion = [];
        vm.alarmsRechazado = [];
        vm.alarmsCanceled = [];
        vm.alarmsAtendido = [];
        vm.alarmsCanceladoCliente = [];
        vm.alarmsCanceladoOperator = [];
        vm.alarmsCanceladoUnidad = [];
        vm.alarms = [];

        data.forEach(function(alarm) {
          // la alarma es de este organismo
          if (alarm.organism === organism) {
            // por status
            if (alarm.status === 'esperando') {
              vm.alarmsEsperando.push(alarm);
            }

            if (alarm.status === 'en atencion') {
              vm.alarmsEnAtencion.push(alarm);
            }

            if (alarm.status === 'rechazado') {
              vm.alarmsRechazado.push(alarm);
            }

            if (alarm.status === 'cancelado por el operador') {
              vm.alarmsCanceled.push(alarm);
            }

            if (alarm.status === 'atendido') {
              vm.alarmsAtendido.push(alarm);
            }

            if (alarm.status === 'cancelado por el cliente') {
              vm.alarmsCanceladoCliente.push(alarm);
            }

            if (alarm.status === 'cancelado por la unidad') {
              vm.alarmsCanceladoUnidad.push(alarm);
            }

            /* if (alarm.status === 'cancelado por la unidad') {
             vm.alarmsCanceladoUnidad.push(alarm);
             }*/

            if (alarm.status === 'esperando' ||
              alarm.status === 'en atencion' ||
              alarm.status === 'cancelado por la unidad') {
              vm.alarms.push(alarm);
            }
          }
        });
      });
    }

    // Obtener diferencia de hora entre el momento de creación de la alarma y hoy
    vm.getDifference = function (alarm) {

      var alarmCreated = new Date(alarm).getTime();
      var today = new Date().getTime();

      var timeDiff = Math.abs(alarmCreated - today);
      var diffHours = Math.floor(timeDiff / 3600000); // horas
      var diffMins = Math.round(timeDiff / (60000)); // minutos
      var diffsec = Math.round(timeDiff / (1000)); // minutos
      return diffHours + ' horas, ' + diffMins + ' minutos';
    };

    // Centrar mapa de acuerdo al item seleccionado
    vm.center = function(item) {
      vm.centerLatitude = item.latitude;
      vm.centerLongitude = item.longitude;
      if (vm.selected && vm.selected.id === item._id) {
        // Se detiene la animacion
        vm.selected = {};
        listNetwork(vm.organism);
        listAlarm((vm.organism[0]._id));
      } else {
        vm.selected = {
          id: item._id
        };
      }
    };

// Evaluar cercanía
    vm.geoNear = function(alarm) {
      vm.new_alarm = alarm;
      var network;

      if (alarm.status === 'esperando') {
        NetworksService.near({lat: alarm.latitude, lng: alarm.longitude}, function(networks) {

          if (networks.length === 0) {
            vm.new_alarm.networkNear = 'No hay cercano';
            if ($window.confirm('No hay unidad cercana que pueda atender el evento, se sugiere hacer una recomendación manual')) {
            }
          } else {
            // Unidad recomendada
            vm.new_alarm.networkNear = networks[0];

            if ($window.confirm('¿Esta seguro que desea asignar la unidad: ' + vm.new_alarm.networkNear.obj.carCode + '?')) {

              // id de la unidad
              vm.new_alarm.network = vm.new_alarm.networkNear.obj._id;

              // ubicacion de la unidad
              vm.new_alarm.networkLatitude = vm.new_alarm.networkNear.obj.latitude;
              vm.new_alarm.networkLongitude = vm.new_alarm.networkNear.obj.longitude;
              // address de la unidad
              vm.new_alarm.networkAddress = vm.new_alarm.networkNear.obj.address;

              // codigo de la unidad
              vm.new_alarm.networkCarCode = vm.new_alarm.networkNear.obj.carCode;

              // status de la alarma
              vm.new_alarm.status = 'en atencion';
              vm.new_alarm.carCode = vm.new_alarm.networkNear.obj.carCode;

              // icono de status
              vm.new_alarm.icon = '/modules/panels/client/img/process.png';


              var firebasetoken;
              var firebasetokenNetwork;
              // Se busca el token del usuario y del serviceuser

              var banderaClient = false;
              var banderaNetwork = false;

              FirebasetokensService.query(function (data) {

                firebasetoken = data.filter(function (data) {
                  return (data.userId.indexOf(vm.new_alarm.user._id) >= 0);
                });


                firebasetokenNetwork = data.filter(function (data) {
                  return (data.userId.indexOf(networks[0].obj.serviceUser) >= 0);
                });

                vm.new_alarm.firebasetoken = firebasetoken[0].token;

                console.log(firebasetokenNetwork[0].token);
                vm.new_alarm.firebasetokenNetwork = firebasetokenNetwork[0].token;

                // Se actualiza la alarma (PUT)
                AlarmsService.update({ alarmId: vm.new_alarm._id}, vm.new_alarm);

                /* data.forEach(function(data) {
                 if (data.userId.indexOf(vm.new_alarm.user._id) >= 0) {
                 vm.new_alarm.firebasetoken = data.token;
                 banderaClient = true;
                 }

                 if (data.userId.indexOf(networks[0].obj.serviceUser) >= 0) {
                 vm.new_alarm.firebasetokenNetwork = data.token;
                 banderaNetwork = true;
                 }
                 });*/
              });

              // aca registro en la unidad el status "ocupado"
              networkServicePUT('ocupado', vm.new_alarm.networkNear.obj._id);

              // se registra en el log
              logServicePOST('Se ha asignado exitosamente la unidad: ' + vm.new_alarm.networkNear.obj.carCode +
                ' a la solicitud de atención: ' + vm.new_alarm._id +
                ' del cliente ' + vm.new_alarm.user.displayName, vm.new_alarm);

              MobileunitlogsServiceCreate.charge({
                mobileUnit: vm.new_alarm.networkNear.obj._id,
                mobileUnitCarCode: vm.new_alarm.networkNear.obj.carCode,
                description: 'Se le fue asignado el evento: ' + vm.new_alarm._id}, function (data) {
                // se realizo el post
              });

              // Se encuentra la unidad
              NetworksService.query(function (data) {
                // El organismo logueado
                network = data.filter(function (data) {
                  return (data._id.indexOf(vm.new_alarm.networkNear.obj._id) >= 0);
                });
                // Se incluye en las direcciones
                var direction = {
                  destination: alarm.latitude + ',' + alarm.longitude,
                  origin: network.latitude + ',' + network.longitude
                };
                // Se incluye la nueva ruta
                vm.directions.push(direction);
                // Se refrescan las rutas
                directionsOnMap();
                // Se refresca el listado de alarmas por status
                listAlarm((vm.organism[0]._id));
                listNetwork((vm.organism));
              });
            } else {
              return;
            }
          }
        });
      }

    };

// Funcion para actualizar un registro (PUT)
    function networkServicePUT(status, id) {
      // GET
      var network = NetworksService.get({ networkId: id});
      network.status = status;
      // PUT
      NetworksService.update({ networkId: id}, network);
    }

// Funcion para crear un nuevo registro (POST)
    function logServicePOST(description, alarm) {
      if (alarm.network === '') {
        LogsServiceCreate.charge({
          description: description,
          alarm: alarm._id,
          client: alarm.user._id,
          organism: vm.organism[0]._id}, function (data) {
          // se realizo el post
        });
      } else {
        LogsServiceCreate.charge({
          description: description,
          alarm: alarm._id,
          network: alarm.network,
          client: alarm.user._id,
          organism: vm.organism[0]._id}, function (data) {
          // se realizo el post
        });
      }

    }

    // Rechazar alarma
    vm.rechazarAlarm = function (alarm) {

      var logText = '';
      // Rechazar

      if ($window.confirm('¿Esta seguro que desea rechazar la solicitud?')) {
        // Se cambia status
        alarm.status = 'rechazado';
        alarm.icon = '/modules/panels/client/img/deleted.png';

        logText = 'Ha sido rechazada la solicitud de atención: ' + alarm._id +
          ' del cliente: ' + alarm.user.displayName +
          ', por el operador: ' + operator[0].displayName;

        var firebasetoken;
        var firebasetokenNetwork;
        // Se busca el token del usuario

        FirebasetokensService.query(function (data) {

          firebasetoken = data.filter(function (data) {
            return (data.userId.indexOf(alarm.user._id) >= 0);
          });

          alarm.firebasetoken = firebasetoken[0].token;

          // Se actualiza la alarma (PUT)
          AlarmsService.update({ alarmId: alarm._id}, alarm, function (data) {
            // se realizo el put
            if (data.status === 'rechazado') {
              // Se refrescan los listados
              listAlarm((vm.organism[0]._id));

              listNetwork((vm.organism));

              // Se refrescan las rutas
              directionsOnMap();
            }
          });

        });

        // Se registra en el log
        logServicePOST(logText, alarm);

      }
    };

    // cancelar alarma
    vm.cancelAlarm = function (alarm) {

      var logText = '';


      if ($window.confirm('¿Esta seguro que desea cancelar la atención?')) {

        // Se cambia status
        alarm.status = 'cancelado por el operador';
        alarm.icon = '/modules/panels/client/img/canceled.png';

        logText = 'Ha sido cancelada la solicitud de atención: ' + alarm._id +
          ' del cliente: ' + alarm.user.displayName +
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

        var firebasetoken;
        var firebasetokenNetwork;
        // Se busca el token del usuario

        FirebasetokensService.query(function (data) {

          firebasetoken = data.filter(function (data) {
            return (data.userId.indexOf(alarm.user._id) >= 0);
          });

          alarm.firebasetoken = firebasetoken[0].token;

          // Se actualiza la alarma (PUT)
          AlarmsService.update({ alarmId: alarm._id}, alarm, function (data) {
            // se realizo el put
            if (data.status === 'cancelado por el operador') {
              // Se refrescan los listados
              listAlarm((vm.organism[0]._id));

              listNetwork((vm.organism));

              // Se refrescan las rutas
              directionsOnMap();
            }
          });

        });

        // Se registra en el log
        logServicePOST(logText, alarm);

      }
    };

// Mostrar detalles de la alarma
    vm.showDetailAlarms = function(e, alarms) {
      vm.new_alarm = alarms;
      CategoriaserviciosService.query(function (data) {
        // Categoría
        vm.new_alarm.categoryName = data.filter(function (data) { return (data._id.indexOf(vm.new_alarm.categoryService) >= 0); });
      });

      // Evaluar cercanía
      vm.geoNear(vm.new_alarm);
      vm.map.showInfoWindow('infoWindowAlarm', alarms._id);
    };

// Mostrar detalle de la unidad
    vm.showDetailNetwork = function(e, network) {
      vm.new_network = network;
      CategoriaserviciosService.query(function (data) {
        // Categoría
        vm.new_network.categoryName = data.filter(function (data) {
          return (data._id.indexOf(vm.new_network.category) >= 0);
        });
      });
      vm.map.showInfoWindow('infoWindowNetwork', network._id);
    };

// Direcciones a recorrer en el mapa
    function directionsOnMap() {

      vm.directions = [];
      NetworksService.query(function (data) {
        data.forEach(function(network) {
          AlarmsService.query(function (data) {
            data.forEach(function (alarm) {
              if (alarm.status.indexOf('en atencion') >= 0 &&
                network._id.indexOf(alarm.network) >= 0) {
                var direction = {
                  destination: alarm.latitude + ',' + alarm.longitude,
                  origin: network.latitude + ',' + network.longitude
                };
                vm.directions.push(direction);
              }
            });
          });
        });
      });
    }
    directionsOnMap();

// instantiate google map objects for directions
    /* var directionsDisplay = new window.google.maps.DirectionsRenderer();
     var directionsService = new window.google.maps.DirectionsService();
     vm.getDirections = function (direction) {
     var request = {
     origin: direction.origin,
     destination: direction.destination,
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
     };*/
  }
}());
