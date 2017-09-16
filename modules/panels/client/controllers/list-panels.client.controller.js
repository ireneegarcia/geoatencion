(function () {
  'use strict';

  angular
    .module('panels')
    .controller('PanelsListController', PanelsListController);

  PanelsListController.$inject = ['PanelsService', 'AlarmsService', 'NgMap', 'NetworksService', 'CategoriaserviciosService', 'UsersService', 'Authentication', '$filter'];

  function PanelsListController(PanelsService, AlarmsService, NgMap, NetworksService, CategoriaserviciosService, UsersService, Authentication, $filter) {
    var vm = this;

    vm.panels = PanelsService.query();
    vm.networks = [];
    vm.directions = [];
    //  vm.network = NetworksService.query();
    vm.centerLatitude = 8.2593534;
    vm.centerLongitude = -62.7734547;

    NgMap.getMap().then(function(map) {
      vm.map = map;
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
          }
        });
      });
    }

    // Todas las alarmas con excepcion de las que ya fueron atendidas
    AlarmsService.query(function (data) {
      // Alarmas con status esperando o en atencion
      vm.alarms = data.filter(function (data) {
        return (data.status.indexOf('esperando') >= 0 ||
        data.status.indexOf('en atencion') >= 0);
      });

      // Alarmas con status esperando o en atencion
      vm.alarmsEsperando = data.filter(function (data) {
        return (data.status.indexOf('esperando') >= 0);
      });
      //  Alarmas en atención
      vm.alarmsEnAtencion = data.filter(function (data) {
        return (data.status.indexOf('en atencion') >= 0);
      });
    });

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

    vm.center = function(alarms) {
      vm.centerLatitude = alarms.latitude;
      vm.centerLongitude = alarms.longitude;
    };

    vm.showDetailAlarms = function(e, alarms) {
      vm.new_alarm = alarms;
      CategoriaserviciosService.query(function (data) {
        // Categoría
        vm.new_alarm.categoryName = data.filter(function (data) {
          return (data._id.indexOf(vm.new_alarm.categoryService) >= 0);
        });
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

    // instantiate google map objects for directions
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    vm.getDirections = function (direction) {
      var request = {
        origin: direction.origin,
        destination: direction.destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };
      directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
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
