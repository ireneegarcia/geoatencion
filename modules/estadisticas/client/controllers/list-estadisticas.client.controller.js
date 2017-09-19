(function () {
  'use strict';

  angular
    .module('estadisticas')
    .controller('EstadisticasListController', EstadisticasListController);

  EstadisticasListController.$inject = ['EstadisticasService', 'AlarmsService', 'LogsService', 'UsersService', 'Authentication'];

  function EstadisticasListController(EstadisticasService, AlarmsService, LogsService, UsersService, Authentication) {
    var vm = this;
    var operator;
    var usuarioID;
    vm.log = [];

    vm.estadisticas = EstadisticasService.query();
    // Casos por status
    AlarmsService.query(function (data) {
      // Alarmas con status esperando o en atencion
      vm.alarmsEsperando = data.filter(function (data) {
        return (data.status.indexOf('esperando') >= 0);
      }).length;
      //  Alarmas en atención
      vm.alarmsEnAtencion = data.filter(function (data) {
        return (data.status.indexOf('en atencion') >= 0);
      }).length;
      //  Alarmas rechazadas
      vm.alarmsRechazado = data.filter(function (data) {
        return (data.status.indexOf('rechazado') >= 0);
      }).length;
    });

    // Condicional para encontrar el organismo relacionado
    if (Authentication.user.roles[0] === 'organism') {
      UsersService.query(function (data) {
        // El organismo logueado
        vm.organism = data.filter(function (data) {
          return (data.email.indexOf(Authentication.user.email) >= 0);
        });
        //listNetwork(vm.organism);
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
          //listNetwork(vm.organism);
        });
      }
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
              console.log(vm.logClient);
            });
          }
        });
      });
    };

  }
}());
