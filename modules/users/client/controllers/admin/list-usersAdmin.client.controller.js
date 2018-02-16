(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserAdminListController', UserAdminListController);

  UserAdminListController.$inject = ['$scope', '$filter', 'AdminService', 'UsersService', 'OrganismsService', 'CategoriaserviciosService'];

  function UserAdminListController($scope, $filter, AdminService, UsersService, OrganismsService, CategoriaserviciosService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.action = action;

    vm.organism = [];
    OrganismsService.query(function (organism) {
      organism.forEach(function(organism) {
        CategoriaserviciosService.query(function (data) {
          data.forEach(function(data) {
            if (data._id === organism.category) {
              organism.category = data.category;
            }
          });
          UsersService.query(function (user) {
            user.forEach(function (user) {
              if (user.roles[0] === 'adminOrganism' && user.organism === organism.rif) {
                organism.admin = user.displayName;
              }
            });
          });
        });
        vm.organism.push(organism);
      });
      vm.buildPager();
    });





    function action(option, organism) {
      if (option === 1) {
        organism.isActive = 'activo';
        trabajadoresOrganismo('activo', organism.rif);
      } else {
        organism.isActive = 'inactivo';
        trabajadoresOrganismo('inactivo', organism.rif);
      }
      // Se actualiza el organismo(PUT)
      OrganismsService.update({organismId: organism._id}, organism);
    }

    // se activan o desactivan todos los trabajadores del organismo
    function trabajadoresOrganismo(status, rif) {
      UsersService.query(function (data) {
        data.forEach(function (data) {
          if (data.organism && data.organism === rif) {
            data.isActive = status;
            /*
            * activa su primer organismo
            * el unico usuario con el organismo en su modelo que no esta activado ni tiene su rol
            * los demás trabajadores si se crean con su rol
            * esto solo aplica la primera vez que se activa el organismo
            * */
            if (data.roles[0] === 'user') {
              data.roles[0] = 'adminOrganism';
            }
            AdminService.update({userId: data._id}, data);
          }
        });
      });
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
