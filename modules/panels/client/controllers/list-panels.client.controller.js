(function () {
  'use strict';

  angular
    .module('panels')
    .controller('PanelsListController', PanelsListController);

  PanelsListController.$inject = ['PanelsService', 'AlarmsService', 'NgMap', 'NetworksService', 'CategoriaserviciosService', 'UsersService', 'Authentication', '$filter', '$timeout', 'SolicitudsService', 'Socket', '$window', 'LogsServiceCreate'];

  function PanelsListController(PanelsService, AlarmsService, NgMap, NetworksService, CategoriaserviciosService, UsersService, Authentication, $filter, $timeout, SolicitudsService, Socket, $window, LogsServiceCreate) {
    var vm = this;

    vm.panels = PanelsService.query();
    vm.networks = [];
    vm.directions = [];
    vm.alarms = [];
    vm.alarmsEsperando = [];
    vm.alarmsEnAtencion = [];
    vm.alarmsRechazado = [];
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
    if (Authentication.user.roles[0] === 'organism') {
      UsersService.query(function (data) {
        // El organismo logueado
        vm.organism = data.filter(function (data) {
          return (data.email.indexOf(Authentication.user.email) >= 0);
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
          vm.organism = data.filter(function (data) {
            return (data._id.indexOf(operator[0].user._id) >= 0);
          });
          listNetwork(vm.organism);
          listAlarm((vm.organism[0]._id));
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
          return (data.user._id.indexOf(organism[0]._id) >= 0);
        });
      });
    }

    // Funcion para listar las alarmas
    function listAlarm(organism) {
      /*
       Todas las alarmas con excepcion de las que ya fueron atendidas
       Se valida que: exista afiliación del usuario con el organismo (solicitud aceptada)
       se valida que la categoría de la solicitud sea la categoría de atención del organismo
       * */
      AlarmsService.query(function (data) {

        vm.alarms = [];
        vm.alarmsEsperando = [];
        vm.alarmsEnAtencion = [];
        data.forEach(function(alarm) {
          if (alarm.status === 'esperando') {
            SolicitudsService.query(function (data) {
              data.forEach(function(solicitud) {

                if (solicitud.organism === organism && solicitud.status === 'aceptado' &&
                  solicitud.user._id === alarm.user._id && solicitud.category === alarm.categoryService) {
                  vm.alarmsEsperando.push(alarm);
                }
              });
            });
          }
          if (alarm.status === 'en atencion') {
            SolicitudsService.query(function (data) {
              data.forEach(function(solicitud) {
                if (solicitud.organism === organism && solicitud.status === 'aceptado' &&
                  solicitud.user._id === alarm.user._id && solicitud.category === alarm.categoryService) {
                  vm.alarmsEnAtencion.push(alarm);
                }
              });
            });
          }
          if (alarm.status === 'esperando' || alarm.status === 'en atencion') {
            SolicitudsService.query(function (data) {
              data.forEach(function(solicitud) {
                if (solicitud.organism === organism && solicitud.status === 'aceptado' &&
                  solicitud.user._id === alarm.user._id && solicitud.category === alarm.categoryService) {
                  vm.alarms.push(alarm);
                }
              });
            });
          }
        });

      });
    }

    function formatString(format) {
      var pieces = format.split('.'),
        year = parseInt(pieces[0], 10),
        month = parseInt(pieces[1], 10),
        day = parseInt(pieces[2], 10),
        hour = parseInt(pieces[3], 10),
        date = new Date(year, month - 1, day, hour);

      return date;
    }

    // Obtener diferencia de hora entre el momento de creación de la alarma y hoy
    vm.getDifference = function (alarm) {
      var today = $filter('date')(new Date(), 'yyyy.MM.dd.HH:mm:ss');
      var alarmCreated = $filter('date')(alarm, 'yyyy.MM.dd.HH:mm:ss');
      var date2 = new Date(formatString(today));
      var date1 = new Date(formatString(alarmCreated));
      var diffDays = date2.getDay() - date1.getDay();
      var diffHours = date2.getHours() - date1.getHours();
      return diffDays + '(dias), ' + diffHours + '(horas)';
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
    function geoNear(new_alarm) {
      NetworksService.near({lat: new_alarm.latitude, lng: new_alarm.longitude}, function(networks) {
        if (networks.length === 0) {
          vm.new_alarm.networkNear = 'No hay cercano';
        } else {
          // Unidad recomendada
          vm.new_alarm.networkNear = networks[0];
        }
      });
    }

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
        LogsServiceCreate.charge({ description: description, alarm: alarm._id, client: alarm.user._id, user: operator[0]._id, organism: vm.organism[0]._id}, function (data) {
          // se realizo el post
        });
      } else {
        LogsServiceCreate.charge({ description: description, alarm: alarm._id, network: alarm.network, client: alarm.user._id, user: operator[0]._id, organism: vm.organism[0]._id}, function (data) {
          // se realizo el post
        });
      }

    }

    // Asignar por recomendación
    vm.assignNear = function (alarm) {
      var network;
      vm.new_alarm = alarm;

      // Evaluar cercanía
      geoNear(vm.new_alarm);

      if (vm.new_alarm.networkNear && vm.new_alarm.networkNear !== 'No hay cercano') {
        if ($window.confirm('¿Esta seguro que desea asignar la unidad: ' + vm.new_alarm.networkNear.obj.carCode + '?')) {

          // Se actualiza la alarma (PUT)
          vm.new_alarm.network = vm.new_alarm.networkNear.obj._id;
          vm.new_alarm.status = 'en atencion';
          vm.new_alarm.icon = '/modules/panels/client/img/process.png';

          // Se actualiza la alarma (PUT)
          AlarmsService.update({ alarmId: alarm._id}, alarm);

          // aca registro en la unidad el status "ocupado"
          networkServicePUT('ocupado', vm.new_alarm.networkNear.obj._id);

          // se registra en el log
          logServicePOST('Se ha asignado la unidad: ' + vm.new_alarm.networkNear.obj.carCode + ' exitosamente', vm.new_alarm);

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
          });
        }
      }
      if (vm.new_alarm.networkNear && vm.new_alarm.networkNear === 'No hay cercano') {
        $window.alert('No existe recomendación para esta solicitud');
      }
    };

    // Rechazar alarma
    vm.cancelAlarm = function (alarm, option) {

      // Rechazar
      if (option === 1) {
        if ($window.confirm('¿Esta seguro que desea rechazar la solicitud?')) {
          // Se cambia status
          alarm.status = 'rechazado';
          alarm.icon = '/modules/panels/client/img/deleted.png';

          // Se actualiza la alarma (PUT)
          AlarmsService.update({ alarmId: alarm._id}, alarm);

          // Se registra en el log
          logServicePOST('La solicitud de atención ha sido rechazada', alarm);

          // Se refresca el listado de alarmas por status
          listAlarm((vm.organism[0]._id));
        }
      }
      // Cancelar
      if (option === 2) {
        if ($window.confirm('¿Esta seguro que desea cancelar la atención?')) {

          // Se cambia status
          alarm.status = 'cancelado';
          alarm.icon = '/modules/panels/client/img/canceled.png';

          // Se actualiza la alarma (PUT)
          AlarmsService.update({ alarmId: alarm._id}, alarm);

          // Se registra en el log
          logServicePOST('La solicitud de atención ha sido cancelada', alarm);
        }
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
      geoNear(vm.new_alarm);
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
    var directionsDisplay = new window.google.maps.DirectionsRenderer();
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
    };
  }
}());
