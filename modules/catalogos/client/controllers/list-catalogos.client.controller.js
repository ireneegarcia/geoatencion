(function () {
  'use strict';

  angular
    .module('catalogos')
    .controller('CatalogosListController', CatalogosListController);

  CatalogosListController.$inject = ['$filter', 'CatalogosService', 'UsersService', 'CategoriaserviciosService', 'NetworksService', 'OrganismsService'];

  function CatalogosListController($filter, CatalogosService, UsersService, CategoriaserviciosService, NetworksService, OrganismsService) {
    var vm = this;

    vm.catalogos = CatalogosService.query();

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.categories = CategoriaserviciosService.query();

    vm.organisms = [];
    OrganismsService.query(function (data) {
      data.forEach(function(organism) {
        if (organism.isActive === 'activo') {
          NetworksService.query(function (network) {
            organism.network = network.filter(function (network) {
              return (network.organism.indexOf(organism.rif) >= 0);
            }).length;
          });
          CategoriaserviciosService.query(function (category) {
            organism.categoryN = category.filter(function (category) {
              return (category._id.indexOf(organism.category) >= 0);
            });
          });
          vm.organisms.push(organism);
        }
      });
      console.log(vm.organisms);
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.organisms, {
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
