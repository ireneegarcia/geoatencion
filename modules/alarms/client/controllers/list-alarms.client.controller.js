(function () {
  'use strict';

  angular
    .module('alarms')
    .controller('AlarmsListController', AlarmsListController);

  AlarmsListController.$inject = ['AlarmsService'];

  function AlarmsListController(AlarmsService) {
    var vm = this;
    vm.alarms = [];
    // Todas las alarmas por status
    AlarmsService.query(function (data) {
      // Alarmas con status esperando o en atencion
      vm.alarmsEsperando = data.filter(function (data) {
        return (data.status.indexOf('esperando') >= 0);
      });
      //  Alarmas en atención
      vm.alarmsEnAtencion = data.filter(function (data) {
        return (data.status.indexOf('en atencion') >= 0);
      });
      //  Alarmas rechazadas
      vm.alarmsRechazado = data.filter(function (data) {
        return (data.status.indexOf('rechazado') >= 0);
      });
    });
  }
}());
