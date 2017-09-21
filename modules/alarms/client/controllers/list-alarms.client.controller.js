(function () {
  'use strict';

  angular
    .module('alarms')
    .controller('AlarmsListController', AlarmsListController);

  AlarmsListController.$inject = ['AlarmsService', '$filter', 'UsersService', 'Authentication', 'SolicitudsService'];

  function AlarmsListController(AlarmsService, $filter, UsersService, Authentication, SolicitudsService) {
    var vm = this;
    vm.alarmsEsperando = [];
    vm.alarmsEnAtencion = [];
    vm.alarmsRechazado = [];

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
          var operator = data.filter(function (data) {
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
  }
}());
