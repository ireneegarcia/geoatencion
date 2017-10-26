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
    vm.alarmsCancelado = [];
    vm.alarmsCanceladoCliente = [];
    vm.alarmsAtendido = [];
    vm.alarmsSinCalificar = [];
    vm.alarmsCalificado = [];
    vm.ratingAll = 0;
    vm.rating = 0;
    vm.rating1 = 0;
    vm.rating2 = 0;
    vm.rating3 = 0;
    vm.rating4 = 0;
    vm.rating5 = 0;
    vm.estadisticas = EstadisticasService.query();

    // Condicional para encontrar el organismo relacionado
    if (Authentication.user.roles[0] === 'organism') {
      UsersService.query(function (data) {
        // El organismo logueado
        vm.organism = data.filter(function (data) {
          return (data.email.indexOf(Authentication.user.email) >= 0);
        });
        getMyAlarms(vm.organism[0]._id);
        logAll();
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
          logAll();
        });
      }
    }


    function getMyAlarms(organism) {

      /*
       Todas las alarmas con excepcion de las que ya fueron atendidas
       * */
      AlarmsService.query(function (data) {

        data.forEach(function(alarm) {
          if (alarm.organism === organism) {
            if (alarm.status === 'esperando') {
              vm.alarmsEsperando.push(alarm);
            }

            if (alarm.status === 'en atencion') {
              vm.alarmsEnAtencion.push(alarm);
            }

            if (alarm.status === 'rechazado') {
              vm.alarmsRechazado.push(alarm);
            }

            if (alarm.status === 'cancelado') {
              vm.alarmsCancelado.push(alarm);
            }

            if (alarm.status === 'cancelado por el cliente') {
              vm.alarmsCanceladoCliente.push(alarm);
            }

            if (alarm.status === 'atendido') {
              vm.alarmsAtendido.push(alarm);
            }

            if (alarm.status === 'atendido' && alarm.rating === 'sin calificar') {
              vm.alarmsSinCalificar.push(alarm);
            }

            if (alarm.status === 'atendido' && alarm.rating !== 'sin calificar') {

              vm.alarmsCalificado.push(alarm);

              vm.rating += 1;
              vm.ratingAll += parseInt(alarm.rating, 10)
              // console.log(alarm.rating);
              switch (alarm.rating) {
                case '1':
                  vm.rating1 += 1;
                  break;
                case '2':
                  vm.rating2 += 1;
                  break;
                case '3':
                  vm.rating3 += 1;
                  break;
                case '4':
                  vm.rating4 += 1;
                  break;
                case '5':
                  vm.rating5 += 1;
                  break;
              }
            }
          }

          /* if (alarm.status === 'esperando') {
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
           }*/
        });
      });

    }

    // Log general del organismo
    function logAll() {
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
    }

    // Log de todos los networks del organismo
    vm.networksAll = function () {
      NetworksService.query(function (data) {
        vm.networks = data.filter(function (data) {
          return (data.user._id.indexOf(vm.organism[0]._id) >= 0);
        });
      });
    };

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
          return (data.carCode.indexOf(networkID) >= 0 && data.user._id.indexOf(vm.organism[0]._id) >= 0);
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
