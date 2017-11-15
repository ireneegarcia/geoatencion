(function () {
  'use strict';

  angular
    .module('organisms')
    .controller('OrganismsListController', OrganismsListController);

  OrganismsListController.$inject = ['OrganismsService'];

  function OrganismsListController(OrganismsService) {
    var vm = this;

    vm.organisms = OrganismsService.query();
  }
}());
