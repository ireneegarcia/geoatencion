(function () {
  'use strict';

  angular
    .module('networks')
    .controller('NetworksListController', NetworksListController);

  NetworksListController.$inject = ['NetworksService', '$filter', 'CategoriaserviciosService'];

  function NetworksListController(NetworksService, $filter, CategoriaserviciosService) {
    var vm = this;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.categories = [
      {id: 1, name: 'Asistencia bomberil'},
      {id: 2, name: 'Asistencia de seguridad'},
      {id: 3, name: 'Asistencia médica'},
      {id: 4, name: 'Todas las anteriores'},
      {id: 5, name: 'Otra categoría'},
      {id: 6, name: 'Diversas categorías'},
    ];

    CategoriaserviciosService.query({}).$promise.then(function (res) {
      vm.categories = [];
      res.forEach(function(cathegory) {
        vm.categories.push({id: cathegory._id, name: cathegory.category});
      });
    });

    vm.networks = NetworksService.query(function (data) {
      vm.networks = data;
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
