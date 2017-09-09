(function () {
  'use strict';

  angular
    .module('panels')
    .controller('PanelsListController', PanelsListController);

  PanelsListController.$inject = ['PanelsService', 'AlarmsService', 'NgMap', 'NetworksService', 'CategoriaserviciosService', 'UsersService', 'Authentication'];

  function PanelsListController(PanelsService, AlarmsService, NgMap, NetworksService, CategoriaserviciosService, UsersService, Authentication) {
    var vm = this;

    vm.panels = PanelsService.query();
    vm.networks = [];
    vm.network = NetworksService.query();

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

    function onClickMarker() {
      console.log('Click');
    }

  }
}());
