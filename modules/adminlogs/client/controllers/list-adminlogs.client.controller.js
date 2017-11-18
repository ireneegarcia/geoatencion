(function () {
  'use strict';

  angular
    .module('adminlogs')
    .controller('AdminlogsListController', AdminlogsListController);

  AdminlogsListController.$inject = ['AdminlogsService', 'Authentication', '$filter', 'UsersService'];

  function AdminlogsListController(AdminlogsService, Authentication, $filter, UsersService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    AdminlogsService.query(function (data) {
      vm.adminLog = data.filter(function (data) {
        return (data.organism.indexOf(vm.authentication.user.organism) >= 0);
      });
      vm.buildPager();
    });

    vm.users = UsersService.query();

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.adminLog, {
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
