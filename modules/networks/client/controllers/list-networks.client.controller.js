(function () {
  'use strict';

  angular
    .module('networks')
    .controller('NetworksListController', NetworksListController);

  NetworksListController.$inject = ['NetworksService', 'Authentication', '$filter', 'CategoriaserviciosService', 'UsersService'];

  function NetworksListController(NetworksService, Authentication, $filter, CategoriaserviciosService, UsersService) {
    var vm = this;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    CategoriaserviciosService.query({}).$promise.then(function (res) {
      vm.categories = [];
      res.forEach(function(cathegory) {
        vm.categories.push({id: cathegory._id, name: cathegory.category});
      });
    });

    vm.organism  = UsersService.query(function (data) {
      // El organismo logueado
      vm.organism = $filter('filter')(data, { email: Authentication.user.email});
    });

    vm.networks = NetworksService.query(function (data) {
      vm.networks = data;
      console.log(vm.networks);
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.networks, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());
