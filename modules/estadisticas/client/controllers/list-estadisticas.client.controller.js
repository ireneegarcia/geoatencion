(function () {
  'use strict';

  angular
    .module('estadisticas')
    .controller('EstadisticasListController', EstadisticasListController);

  EstadisticasListController.$inject = ['EstadisticasService'];

  function EstadisticasListController(EstadisticasService) {
    var vm = this;

    vm.estadisticas = EstadisticasService.query();
  }
}());
