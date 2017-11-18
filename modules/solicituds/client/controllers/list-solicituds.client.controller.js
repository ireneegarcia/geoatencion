(function () {
  'use strict';

  angular
    .module('solicituds')
    .controller('SolicitudsListController', SolicitudsListController);

  SolicitudsListController.$inject = ['SolicitudsService', 'UsersService', '$filter', 'Authentication', 'OrganismsService'];

  function SolicitudsListController(SolicitudsService, UsersService, $filter, Authentication, OrganismsService) {
    var vm = this;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    // Condicional para encontrar el organismo relacionado
    if (Authentication.user.roles[0] === 'adminOrganism') {
      OrganismsService.query(function (data) {
        // Organismo
        vm.organism = data.filter(function (data) {
          return (data.rif.indexOf(Authentication.user.organism) >= 0);
        });
        SolicitudsService.query(function (data) {
          /*
           data.user._id en caso de que sea un usuario cliente
           data.organism en caso de que sea un organismo
           * */
          vm.solicituds = data.filter(function (data) {
            return (data.organism.indexOf(vm.organism[0]._id) >= 0);
          });
          vm.buildPager();
        });
      });
    } else {
      if (Authentication.user.roles[0] === 'user') {
        UsersService.query(function (data) {
          vm.user = data.filter(function (data) {
            return (data.email.indexOf(Authentication.user.email) >= 0);
          });
          SolicitudsService.query(function (data) {
            /*
             data.user._id en caso de que sea un usuario cliente
             data.organism en caso de que sea un organismo
             * */
            vm.solicituds = data.filter(function (data) {
              return (data.user._id.indexOf(vm.user[0]._id) >= 0);
            });

            OrganismsService.query(function (data) {
              // Organismos
              vm.organism = data.filter(function (data) {
                return (data.isActive.indexOf('activo') >= 0);
              });
            });
            vm.buildPager();
          });
        });
      }
    }

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
