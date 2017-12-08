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
    /*$scope.heatmapData = [
      new window.google.maps.LatLng(8.2594339, -62.7737288)
    ];*/

    NgMap.getMap().then(function(map) {
      vm.map = map;
    });

    vm.mobileUnitLogFinal = [];
    var mobileUnitLogFinal;
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
      });

      MobileunitlogsService.query(function (data) {

        vm.mobileUnitLog = data.filter(function (data) {
          return (data.mobileUnitCarCode.indexOf(carCode) >= 0);
        });
        var j = 0;
        for (var i = vm.mobileUnitLog.length - 1; i >= 0; i--) {

          var descriptionInactivo = vm.mobileUnitLog[i].description.substring(35, 43);

          if (descriptionInactivo.indexOf('inactivo') >= 0) {
            var createdInactivo = $filter('date')(vm.mobileUnitLog[i].created, 'yyyy/MM/dd HH:mm:ss');

            if ((i - 1) >= 0) {
              if (vm.mobileUnitLog[i - 1].description.indexOf('activo, ') >= 0) {
                var createdActivo = $filter('date')(vm.mobileUnitLog[i - 1].created, 'yyyy/MM/dd HH:mm:ss');
                // vm.mobileUnitLogFinal[j] = 'La unidad duro en estado inactivo en el periodo de ' + createdInactivo + ', hasta ' + createdActivo;
                mobileUnitLogFinal = {
                  action: 'Estado inactivo',
                  createdInicial: createdInactivo,
                  createdFinal: createdActivo
                };
                vm.mobileUnitLogFinal.push(mobileUnitLogFinal);
              }
            } else {
              // vm.mobileUnitLogFinal[j] = 'La unidad entro en estado inactivo desde ' + createdInactivo + ', hasta la actualidad';
              mobileUnitLogFinal = {
                action: 'Estado inactivo',
                createdInicial: createdInactivo,
                createdFinal: 'hasta la actualidad'
              };
              vm.mobileUnitLogFinal.push(mobileUnitLogFinal);
            }
            j++;
          }


          var descriptionAtencion = vm.mobileUnitLog[i].description.substring(0, 28);

          if (descriptionAtencion.indexOf('Se le fue asignado el evento') >= 0) {
            var createdAsginacion = $filter('date')(vm.mobileUnitLog[i].created, 'yyyy/MM/dd HH:mm:ss');
            if ((i - 1) >= 0) {
              if (vm.mobileUnitLog[i - 1].description.indexOf('Ha sido atendido exitosament') >= 0) {
                var createdAtendido = $filter('date')(vm.mobileUnitLog[i - 1].created, 'yyyy/MM/dd HH:mm:ss');
                // vm.mobileUnitLogFinal[j] = 'La unidad duro en el proceso de atención desde ' + createdAsginacion + ', hasta ' + createdAtendido;
                mobileUnitLogFinal = {
                  action: 'En atención',
                  createdInicial: createdAsginacion,
                  createdFinal: createdAtendido
                };
                vm.mobileUnitLogFinal.push(mobileUnitLogFinal);
              } else {
                // vm.mobileUnitLogFinal[j] = 'La unidad comenzo el proceso de atención desde ' + createdAsginacion + ', hasta la actualidad';
                mobileUnitLogFinal = {
                  action: 'En atención',
                  createdInicial: createdAsginacion,
                  createdFinal: 'hasta la actualidad'
                };
                vm.mobileUnitLogFinal.push(mobileUnitLogFinal);
              }
              j++;
            }
          }

        }
        console.log(vm.mobileUnitLogFinal);
      });
    };

    $scope.heatmapDatanew = [];

    function fillHeatMapData(mobileUnitHistory) {
      for (var i = 0; i < mobileUnitHistory.length; i++) {
        $scope.heatmapDatanew.push(new window.google.maps.LatLng(mobileUnitHistory[i].latitude, mobileUnitHistory[i].longitude));
      }
      var heatMapLayer = new window.google.maps.visualization.HeatmapLayer({
        data: $scope.heatmapDatanew,
        radius: 20
      });
      heatMapLayer.setMap(vm.map);
    }
  }
}());
