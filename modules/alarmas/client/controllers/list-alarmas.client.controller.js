(function () {
  'use strict';

  angular
    .module('alarmas')
    .controller('AlarmasListController', AlarmasListController);

  AlarmasListController.$inject = ['AlarmasService'];

  function AlarmasListController(AlarmasService) {
    var vm = this;

    vm.alarmas = AlarmasService.query();
  }
}());
