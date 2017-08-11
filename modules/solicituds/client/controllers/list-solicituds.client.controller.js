(function () {
  'use strict';

  angular
    .module('solicituds')
    .controller('SolicitudsListController', SolicitudsListController);

  SolicitudsListController.$inject = ['SolicitudsService', 'UsersService', '$filter', 'Authentication'];

  function SolicitudsListController(SolicitudsService, UsersService, $filter, Authentication) {
    var vm = this;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.solicituds = SolicitudsService.query(function (data) {
      vm.solicituds = data;
      vm.buildPager();
    });

    // El usuario que inicio sesión
    vm.user = UsersService.query(function (data) {
      vm.user = $filter('filter')(data, { email: Authentication.user.email});
    });

    // Organismos
    vm.organism = UsersService.query(function (data) {
      vm.organism = $filter('filter')(data, { roles: 'organism'});
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.solicituds, {
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
