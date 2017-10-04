(function () {
  'use strict';

  angular
    .module('firebasetokens')
    .controller('FirebasetokensListController', FirebasetokensListController);

  FirebasetokensListController.$inject = ['FirebasetokensService'];

  function FirebasetokensListController(FirebasetokensService) {
    var vm = this;

    vm.firebasetokens = FirebasetokensService.query();
  }
}());
