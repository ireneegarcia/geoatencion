(function () {
  'use strict';

  angular
    .module('branches')
    .controller('BranchesListController', BranchesListController);

  BranchesListController.$inject = ['BranchesService'];

  function BranchesListController(BranchesService) {
    var vm = this;

    vm.branches = BranchesService.query();
  }
}());
