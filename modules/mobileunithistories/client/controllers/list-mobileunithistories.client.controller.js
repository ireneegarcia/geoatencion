(function () {
  'use strict';

  angular
    .module('mobileunithistories')
    .controller('MobileunithistoriesListController', MobileunithistoriesListController);

  MobileunithistoriesListController.$inject = ['MobileunithistoriesService', 'NetworksService', 'Authentication', 'UsersService', '$filter', 'NgMap'];

  function MobileunithistoriesListController(MobileunithistoriesService, NetworksService, Authentication, UsersService, $filter, NgMap) {
    var vm = this;

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
        });
      });
    };

  }
}());
