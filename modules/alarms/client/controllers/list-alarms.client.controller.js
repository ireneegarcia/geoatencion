(function () {
  'use strict';

  angular
    .module('alarms')
    .controller('AlarmsListController', AlarmsListController);

  AlarmsListController.$inject = ['AlarmsService'];

  function AlarmsListController(AlarmsService) {
    var vm = this;

    vm.alarms = AlarmsService.query();
  }
}());
