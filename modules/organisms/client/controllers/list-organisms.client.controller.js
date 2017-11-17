(function () {
  'use strict';

  angular
    .module('organisms')
    .controller('OrganismsListController', OrganismsListController);

  OrganismsListController.$inject = ['OrganismsService', 'Authentication', 'CategoriaserviciosService'];

  function OrganismsListController(OrganismsService, Authentication, CategoriaserviciosService) {
    var vm = this;
    vm.authentication = Authentication;


    OrganismsService.query(function (data) {
      // Organismo
      vm.organisms = data.filter(function (data) {
        return (data.rif.indexOf(vm.authentication.user.organism) >= 0);
      });
    });

    vm.categories = CategoriaserviciosService.query();
  }
}());
