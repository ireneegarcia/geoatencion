(function () {
  'use strict';

  angular
    .module('networks')
    .controller('NetworksListController', NetworksListController);

  NetworksListController.$inject = ['NetworksService'];

  function NetworksListController(NetworksService) {
    var vm = this;

    vm.networks = NetworksService.query();
  }
}());
