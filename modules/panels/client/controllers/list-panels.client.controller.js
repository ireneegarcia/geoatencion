(function () {
  'use strict';

  angular
    .module('panels')
    .controller('PanelsListController', PanelsListController);

  PanelsListController.$inject = ['PanelsService', 'AlarmsService', 'NgMap', 'NetworksService', 'CategoriaserviciosService', 'UsersService', 'Authentication', '$filter', '$timeout', 'SolicitudsService', 'Socket'];

  function PanelsListController(PanelsService, AlarmsService, NgMap, NetworksService, CategoriaserviciosService, UsersService, Authentication, $filter, $timeout, SolicitudsService, Socket) {
    var vm = this;

    vm.panels = PanelsService.query();
    vm.networks = [];
    vm.directions = [];
    vm.alarms = [];
    vm.alarmsEsperando = [];
    vm.alarmsEnAtencion = [];
    vm.alarmsRechazado = [];
    //  vm.network = NetworksService.query();
    vm.centerLatitude = 8.2593534;
    vm.centerLongitude = -62.7734547;

    function formatString(format) {
      var pieces = format.split('.'),
        year = parseInt(pieces[0]),
        month = parseInt(pieces[1]),
        day = parseInt(pieces[2]),
        hour = parseInt(pieces[3]),
        date = new Date(year, month - 1, day, hour);

      return date;
    }

    vm.getDifference = function (alarm) {
      var today = $filter('date')(new Date(), 'yyyy.MM.dd.HH:mm:ss');
      var alarmCreated = $filter('date')(alarm, 'yyyy.MM.dd.HH:mm:ss');
      var date2 = new Date(formatString(today));
      var date1 = new Date(formatString(alarmCreated));
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      //var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
      var diffDays =  date2.getDay() - date1.getDay();
      var diffHours =  date2.getHours() - date1.getHours();
      return diffDays + '(dias), ' + diffHours + '(horas)';
    };

    NgMap.getMap().then(function(map) {
      vm.map = map;
    });

    // Add an event listener to the 'alarmEvent' event
    Socket.on('alarmEvent', function (alarm) {
      vm.alarms.push(alarm);
      listAlarm((vm.organism[0]._id));
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
          var operator = data.filter(function (data) {
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

    vm.showDetailAlarms = function(e, alarms) {
      vm.new_alarm = alarms;
      CategoriaserviciosService.query(function (data) {
        // Categoría
        vm.new_alarm.categoryName = data.filter(function (data) { return (data._id.indexOf(vm.new_alarm.categoryService) >= 0); });
      });
      NetworksService.near({lat: vm.new_alarm.latitude, lng: vm.new_alarm.longitude}, function(networks) {
        if (networks.length === 0) {
          vm.new_alarm.networkNear = 'No hay cercano';
        } else {
          // Unidad recomendada
          vm.new_alarm.networkNear = networks[0];
        }
      });
      vm.map.showInfoWindow('infoWindowAlarm', alarms._id);
    };

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
