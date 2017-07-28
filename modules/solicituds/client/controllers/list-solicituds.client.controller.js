(function () {
  'use strict';

  angular
    .module('solicituds')
    .controller('SolicitudsListController', SolicitudsListController);

  SolicitudsListController.$inject = ['SolicitudsService'];

  function SolicitudsListController(SolicitudsService) {
    var vm = this;

    vm.solicituds = SolicitudsService.query();
  }
}());
