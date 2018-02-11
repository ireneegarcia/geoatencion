(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserAdminListController', UserAdminListController);

  UserAdminListController.$inject = ['$scope', '$filter', 'UsersService', 'OrganismsService', 'CategoriaserviciosService'];

  function UserAdminListController($scope, $filter, UsersService, OrganismsService, CategoriaserviciosService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.action = action;

    OrganismsService.query(function (data) {
      vm.organism = data;
      vm.buildPager();
    });

    CategoriaserviciosService.query(function (data) {
      vm.categories = data;
    });

    function action(option, organism) {
      if (option === 1) {
        organism.isActive = 'activo';

        // se activan todos los trabajadores del organismo

        /*UsersService.query(function (data) {
          data.forEach(function (data) {
            if (data.organism && data.organism === organism.rif) {
              console.log(data.organism);
            }
          });
        });*/

      } else {
        organism.isActive = 'inactivo';

        // se desactivan todos los trabajadores del organismo
      }

      // Se actualiza el organismo(PUT)
      OrganismsService.update({organismId: organism._id}, organism);
    }
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.organism, {
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
