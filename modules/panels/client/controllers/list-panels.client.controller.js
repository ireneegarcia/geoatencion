(function () {
  'use strict';

  angular
    .module('panels')
    .controller('PanelsListController', PanelsListController);

  PanelsListController.$inject = ['PanelsService', 'AlarmsService', 'NgMap', 'NetworksService', 'CategoriaserviciosService'];

  function PanelsListController(PanelsService, AlarmsService, NgMap, NetworksService, CategoriaserviciosService) {
    var vm = this;

    vm.panels = PanelsService.query();
    vm.alarms = AlarmsService.query();
    vm.network = NetworksService.query();

    NgMap.getMap().then(function(map) {
      vm.map = map;
    });

    vm.showDetailAlarms = function(e, alarms) {
      vm.new_alarm = alarms;
      CategoriaserviciosService.query(function (data) {
        // Categoría
        vm.new_alarm.categoryName = data.filter(function (data) {
          return (data._id.indexOf(vm.new_alarm.categoryService) >= 0);
        });
      });
      vm.map.showInfoWindow('infoWindowAlarm', alarms._id);
    };

    vm.showDetailNetwork = function(e, network) {
      vm.new_network = network;
      CategoriaserviciosService.query(function (data) {
        // Categoría
        vm.new_network.categoryName = data.filter(function (data) {
          return (data._id.indexOf(vm.new_network.category) >= 0);
        });
      });
      vm.map.showInfoWindow('infoWindowNetwork', network._id);
    };

    function onClickMarker() {
      console.log('Click');
    }

  }
}());
