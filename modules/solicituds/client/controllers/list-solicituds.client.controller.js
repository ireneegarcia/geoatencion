(function () {
  'use strict';

  angular
    .module('solicituds')
    .controller('SolicitudsListController', SolicitudsListController);

  SolicitudsListController.$inject = ['SolicitudsService', 'UsersService', '$filter', 'Authentication'];

  function SolicitudsListController(SolicitudsService, UsersService, $filter, Authentication) {
    var vm = this;

    vm.solicituds = SolicitudsService.query();
console.log(vm.solicituds);
    // El usuario que inicio sesión
    vm.user = UsersService.query(function (data) {
      vm.user = $filter('filter')(data, { email: Authentication.user.email});
    });

    // Organismos
    vm.organism = UsersService.query(function (data) {
      vm.organism = $filter('filter')(data, { roles: 'organism'});
    });


  }
}());
