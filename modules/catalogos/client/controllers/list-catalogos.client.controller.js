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
     // console.log(vm.categories);
    });

    // Organismos
    var user = UsersService.query(function (data) {
      user = $filter('filter')(data, { roles: 'organism'});
      usersCount(user);
    });

    // Conteo de networks por organismos
    vm.users = [];
    function usersCount(res) {
      res.forEach(function(usersData) {
        var number = 0;
        NetworksService.query({}).$promise.then(function (data) {
          data.forEach(function (data) {
            if (data.user._id === usersData._id) {
              number++;
            }
          });
         /* console.log(usersData._id + ' ' + usersData.displayName+ ' ' +
            usersData.category+ ' '+ number); */
          vm.users.push({_id: usersData._id, displayName: usersData.displayName, category: usersData.category, network: number, created: usersData.created, profileImageURL: usersData.profileImageURL, about: usersData.about});
          console.log(vm.users);
          vm.buildPager();
        });
      });
    }

    /* vm.networks = NetworksService.query(function (data) {
     vm.networks = data;
     });*/

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
