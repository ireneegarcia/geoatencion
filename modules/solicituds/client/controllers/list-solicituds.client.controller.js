(function () {
  'use strict';

  angular
    .module('solicituds')
    .controller('SolicitudsListController', SolicitudsListController);

  SolicitudsListController.$inject = ['SolicitudsService', 'UsersService', '$filter', 'Authentication', 'OrganismsService', 'CategoriaserviciosService'];

  function SolicitudsListController(SolicitudsService, UsersService, $filter, Authentication, OrganismsService, CategoriaserviciosService) {
    var vm = this;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.categoriaservicios = CategoriaserviciosService.query();

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
          vm.solicituds = [];
          data.forEach(function(data) {
            if (data.organism.indexOf(vm.organism[0]._id) >= 0) {
              vm.categoriaservicios.forEach(function(category) {
                if (data.category === category._id) {
                  data.category = category.category;
                  data.organism = vm.organism.name;
                  vm.solicituds.push(data);
                }
              });
            }
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

            vm.solicituds = [];
            data.forEach(function(data) {
              if (data.user._id.indexOf(vm.user[0]._id) >= 0) {
                vm.categoriaservicios.forEach(function(category) {
                  if (data.category === category._id) {
                    data.category = category.category;
                  }
                  OrganismsService.query(function (organism) {
                    organism.forEach(function(organism) {
                      if (data.organism === organism._id) {
                        data.organism = organism.name;
                      }
                    });
                  });
                  vm.solicituds.push(data);
                });
              }
            });

            OrganismsService.query(function (data) {
              // Organismos
              vm.organism = [];
              data.forEach(function(data) {
                if (data.isActive === 'activo') {
                  vm.organism.push(data);
                }
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
