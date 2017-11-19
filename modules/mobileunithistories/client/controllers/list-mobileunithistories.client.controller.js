(function () {
  'use strict';

  angular
    .module('mobileunithistories')
    .controller('MobileunithistoriesListController', MobileunithistoriesListController);

  MobileunithistoriesListController.$inject = ['$scope', 'MobileunithistoriesService', 'NetworksService', 'Authentication', 'UsersService', '$filter', 'NgMap', 'MobileunitlogsService'];

  function MobileunithistoriesListController($scope, MobileunithistoriesService, NetworksService, Authentication, UsersService, $filter, NgMap, MobileunitlogsService) {
    var vm = this;

    vm.centerLatitude = 8.2593534;
    vm.centerLongitude = -62.7734547;

    // Condicional para encontrar el organismo relacionado
    if (Authentication.user.roles[0] === 'adminOrganism') {
      UsersService.query(function (data) {
        // El admin organismo logueado
        vm.organism = data.filter(function (data) {
          return (data.email.indexOf(Authentication.user.email) >= 0);
        });
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
        });
      }
    }

    /* Data points defined as an array of LatLng objects */
    $scope.heatmapData = [
      new window.google.maps.LatLng(8.2594339, -62.7737288)
    ];

    NgMap.getMap().then(function(map) {
      vm.map = map;
    });

    vm.searchNetwork = function (carCode) {
      NetworksService.query(function (data) {
        vm.network = data.filter(function (data) {
          return (data.carCode.indexOf(carCode) >= 0);
        });
        MobileunithistoriesService.query(function (data) {
          vm.mobileUnitHistory = data.filter(function (data) {
            return (data.mobileUnit.indexOf(vm.network[0]._id) >= 0);
          });
          fillHeatMapData(vm.mobileUnitHistory);
        });
        MobileunitlogsService.query(function (data) {
          vm.mobileUnitLog = data.filter(function (data) {
            return (data.mobileUnit.indexOf(vm.network[0]._id) >= 0);
          });
        });
      });
    };

    $scope.heatmapDatanew = [];

    function fillHeatMapData(mobileUnitHistory) {

      for (var i = 0; i < mobileUnitHistory.length; i++) {
        $scope.heatmapDatanew.push(
          new window.google.maps.LatLng(mobileUnitHistory[i].latitude,
            mobileUnitHistory[i].longitude));

      }
      console.log($scope.heatmapDatanew);
    }
  }
}());
