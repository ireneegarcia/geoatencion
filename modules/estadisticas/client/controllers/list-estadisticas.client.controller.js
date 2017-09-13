(function () {
  'use strict';

  angular
    .module('estadisticas')
    .controller('EstadisticasListController', EstadisticasListController);

  EstadisticasListController.$inject = ['EstadisticasService', 'AlarmsService'];

  function EstadisticasListController(EstadisticasService, AlarmsService) {
    var vm = this;
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
  }
}());
