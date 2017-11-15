(function () {
  'use strict';

  angular
    .module('mobileunithistories')
    .controller('MobileunithistoriesListController', MobileunithistoriesListController);

  MobileunithistoriesListController.$inject = ['MobileunithistoriesService'];

  function MobileunithistoriesListController(MobileunithistoriesService) {
    var vm = this;

    vm.mobileunithistories = MobileunithistoriesService.query();
  }
}());
