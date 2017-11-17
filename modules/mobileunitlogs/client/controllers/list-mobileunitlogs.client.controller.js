(function () {
  'use strict';

  angular
    .module('mobileunitlogs')
    .controller('MobileunitlogsListController', MobileunitlogsListController);

  MobileunitlogsListController.$inject = ['MobileunitlogsService'];

  function MobileunitlogsListController(MobileunitlogsService) {
    var vm = this;

    vm.mobileunitlogs = MobileunitlogsService.query();
  }
}());
