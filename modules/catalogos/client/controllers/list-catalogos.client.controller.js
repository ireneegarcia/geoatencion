(function () {
  'use strict';

  angular
    .module('catalogos')
    .controller('CatalogosListController', CatalogosListController);

  CatalogosListController.$inject = ['$filter', 'CatalogosService', 'UsersService', 'CategoriaserviciosService', 'NetworksService'];

  function CatalogosListController($filter, CatalogosService, UsersService, CategoriaserviciosService, NetworksService) {
    var vm = this;

    vm.catalogos = CatalogosService.query();

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    CategoriaserviciosService.query({}).$promise.then(function (res) {
      vm.categories = [];
      res.forEach(function(cathegory) {
        vm.categories.push({id: cathegory._id, name: cathegory.category});
      });
    });

    vm.users = [];
    var networks = NetworksService.query({}).$promise.then(function (data) {
      networks = data;
    });

    UsersService.query(function (data) {
      var users = $filter('filter')(data, { roles: 'organism'});
      users.forEach(function(user) {
        user.network = networks.filter(function (network) {return network.user._id === user._id;}).length;
        vm.users.push(user);
      });
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
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
