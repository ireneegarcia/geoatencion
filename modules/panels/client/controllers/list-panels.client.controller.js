(function () {
  'use strict';

  angular
    .module('panels')
    .controller('PanelsListController', PanelsListController);

  PanelsListController.$inject = ['PanelsService'];

  function PanelsListController(PanelsService) {
    var vm = this;

    vm.panels = PanelsService.query();
  }
}());
