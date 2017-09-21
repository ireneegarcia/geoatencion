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

    UsersService.query(function (data) {

      // El usuario que inicio sesión
      vm.user = data.filter(function (data) {
        return (data.email.indexOf(Authentication.user.email) >= 0);
      });

      // Organismos
      vm.organism = data.filter(function (data) {
        return (data.roles.indexOf('organism') >= 0);
      });
    });

    SolicitudsService.query(function (data) {
      /*
       data.user._id en caso de que sea un usuario cliente
       data.organism en caso de que sea un organismo
       * */
      vm.solicituds = data.filter(function (data) {
        return (data.user._id.indexOf(vm.user[0]._id) >= 0 ||
        data.organism.indexOf(vm.user[0]._id) >= 0);
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
