(function () {
  'use strict';

  angular
    .module('estadisticas')
    .controller('EstadisticasListController', EstadisticasListController);

  EstadisticasListController.$inject = ['EstadisticasService', 'AlarmsService', 'LogsService', 'UsersService', 'Authentication', 'NetworksService', 'SolicitudsService'];

  function EstadisticasListController(EstadisticasService, AlarmsService, LogsService, UsersService, Authentication, NetworksService, SolicitudsService) {
    var vm = this;
    var operator;
    var usuarioID;
    vm.log = [];
    vm.logNetwork = [];
    vm.alarmsEsperando = [];
    vm.alarmsEnAtencion = [];
    vm.alarmsRechazado = [];

    vm.estadisticas = EstadisticasService.query();

    // Condicional para encontrar el organismo relacionado
    if (Authentication.user.roles[0] === 'organism') {
      UsersService.query(function (data) {
        // El organismo logueado
        vm.organism = data.filter(function (data) {
          return (data.email.indexOf(Authentication.user.email) >= 0);
        });
        getMyAlarms(vm.organism[0]._id);
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
          getMyAlarms(vm.organism[0]._id);
        });
      }
    }

    function getMyAlarms(organism) {

      /*
       Todas las alarmas con excepcion de las que ya fueron atendidas
       Se valida que: exista afiliación del usuario con el organismo (solicitud aceptada)
       se valida que la categoría de la solicitud sea la categoría de atención del organismo
       * */
      AlarmsService.query(function (data) {

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
          if (alarm.status === 'rechazado') {
            SolicitudsService.query(function (data) {
              data.forEach(function(solicitud) {
                if (solicitud.organism === organism && solicitud.status === 'aceptado' &&
                  solicitud.user._id === alarm.user._id && solicitud.category === alarm.categoryService) {
                  vm.alarmsRechazado.push(alarm);
                }
              });
            });
          }
        });
      });
    }

    // Log general del organismo
    LogsService.query(function (data) {
      data.forEach(function(log) {
        if (log.organism.indexOf(vm.organism[0]._id) >= 0) {
          // El email del usuario
          UsersService.query(function (data) {
            data.forEach(function (user) {
              if (user._id.indexOf(log.client) >= 0) {
                log.clientEmail = user.email;
              }
              if (user._id.indexOf(log.user._id) >= 0) {
                log.operatorEmail = user.email;
              }
            });
          });
          vm.log.push(log);
        }
      });
    });

    // Log por usuario
    vm.searchUser = function (userEmail) {
      // Usuario
      UsersService.query(function (data) {
        data.forEach(function (user) {
          if (user.email.indexOf(userEmail) >= 0) {
            // Log
            LogsService.query(function (data) {
              vm.logClient = data.filter(function (data) {
                return (data.client.indexOf(user._id) >= 0);
              });
            });
          }
        });
      });
    };

    // Log por network
    vm.searchNetwork = function (networkID) {

      vm.logNetwork = [];

      // Se busca el network
      NetworksService.query(function (data) {
        // Network asignado
        vm.networkSearch = data.filter(function (data) {
          return (data.carCode.indexOf(networkID) >= 0);
        });
      });

      LogsService.query(function (data) {
        data.forEach(function(log) {
          if (log.organism.indexOf(vm.organism[0]._id) >= 0 && log.network.indexOf(vm.networkSearch[0]._id) >= 0) {
            // El email del usuario
            UsersService.query(function (data) {
              data.forEach(function (user) {
                if (user._id.indexOf(log.client) >= 0) {
                  log.clientEmail = user.email;
                }
                if (user._id.indexOf(log.user._id) >= 0) {
                  log.operatorEmail = user.email;
                }
              });
            });
            vm.logNetwork.push(log);
          }
        });
      });
    };

  }
}());
